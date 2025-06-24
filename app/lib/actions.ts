"use server";

import { auth, getUser, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import clientPromise from "./db/mongodb";
import { ObjectId } from "mongodb";


// types and schemas

const UserFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please write a name.",
  }),
  email: z.string({
    invalid_type_error: "Please write an email.",
  }),
  password: z
    .string()
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value ?? ""
        ),
      "Password should have 1 small and 1 capital letter, 1 number, 1 special character without dot(.). It has to be minimum of length 8."
    ),
  contact: z.string({
    invalid_type_error: "Please write a phone number.",
  }),
  user_role: z.string({
    invalid_type_error: "Please select a role for the user.",
  }),
  address: z.string({
    invalid_type_error: "Please write an address.",
  }),
  date: z.string(),
});

export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    contact?: string[];
    user_role?: string[];
    address?: string[];
  };
  message?: string | null;
};

const OfficeFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please write office name.",
  }).min(1, "Please write office name."),
  address: z.string({
    invalid_type_error: "Please write office address.",
  }).min(1, "Please write office/branch address/location."),
  manager: z.string({
    invalid_type_error: "Please write manager name.",
  }).min(1, "Please write manager name."),
  contact: z.string({
    invalid_type_error: "Please write contact info.",
  }).min(1, "Please write contact info."),
  bin: z.string({
    invalid_type_error: "Please provide the business identification number."
  }).min(1, "Please provide the business identification number."),
  date: z.string(),
});

export type OfficeState = {
  errors?: {
    name?: string[];
    address?: string[];
    manager?: string[];
    contact?: string[];
    bin?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    address?: string;
    manager?: string;
    contact?: string;
    bin?: string;
  }
};

const PurchaseTicketFormSchema = z.object({
  id: z.string(),
  purchase_date: z.string({
    invalid_type_error: "Please select date.",
  }).min(1, "Please select date."),
  airline: z.string({
    invalid_type_error: "Please select airline.",
  }).min(1, "Please select airline."),
  route: z.string({
    invalid_type_error: "Please select route.",
  }).min(1, "Please select route."),
  pnr: z.string({
    invalid_type_error: "Please write pnr code.",
  }).min(1, "Please write pnr code."),
  pax: z.coerce
    .number()
    .gt(0, { message: "Passenger number must be at least 1." }),
  ticket_price: z.coerce
  .number()
  .gt(0, { message: "Ticket price must be at least 1 Taka." }),
  selling_price: z.coerce
  .number()
  .gt(0, { message: "Selling price must be at least 1 Taka." }),
  is_umrah: z.boolean({
    invalid_type_error: "Please specify if this is for umrah.",
  }),
  date: z.string(),
});

export type PurchaseTicketState = {
  errors?: {
    purchase_date?: string[];
    airline?: string[];
    route?: string[];
    pnr?: string[];
    pax?: string[];
    ticket_price?: string[];
    selling_price?: string[];
    is_umrah?: string[];
  };
  message?: string | null;
  values?: {
    purchase_date?: string;
    airline?: string;
    route?: string;
    pnr?: string;
    pax?: string;
    ticket_price?: string;
    selling_price?: string;
    is_umrah?: boolean;
  }
};

const SellTicketSchema = z.object({
  passengers: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  }, {
    message: "Invalid passenger data.",
  }),
});

export type SellTicketState = {
  errors?: {
    passengers?: string[];
  };
  message?: string | null;
};

const UmrahGroupFormSchema = z.object({
  groupType: z.enum(["new", "existing"]),
  groupMonth: z.string().optional(),
  groupId: z.string().optional(),
  ticketIds: z.array(z.string()).min(1, "At least one PNR is required."),
});

export type UmrahGroupState = {
  status?: string | null;
  errors?: {
    groupType?: string[];
    groupName?: string[];
    groupId?: string[];
    ticketIds?: string[];
  };
  message?: string | null;
};




// users actions
const CreateUser = UserFormSchema.omit({ id: true, date: true });
export async function createUser(prevState: UserState, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    contact: formData.get("contact"),
    user_role: formData.get("user_role"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }

  const { name, email, password, contact, user_role, address } =
    validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const image_url = "/customers/evil-rabbit.png";
  const date = new Date().toISOString().split("T")[0];

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("users");

    await collection.insertOne({
      name,
      email,
      password: hashedPassword,
      contact,
      user_role,
      address,
      image_url,
      created_at: date,
    });

    revalidatePath("/dashboard/users");
    return { message: "User created successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Create User." };
  }
}

export async function deleteUser(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("users");

    await collection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/dashboard/users");
    return { message: "Deleted User." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Delete User." };
  }
}

// office actions
const CreateOffice = OfficeFormSchema.omit({ id: true, date: true });
export async function createOffice(prevState: OfficeState, formData: FormData) {
  const validatedFields = CreateOffice.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    manager: formData.get("manager"),
    contact: formData.get("contact"),
    bin: formData.get("bin"),
  });

  if (!validatedFields.success) {
    console.log("error:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Office.",
      values: {
        name: formData.get("name")?.toString() || "",
        address: formData.get("address")?.toString() || "",
        manager: formData.get("manager")?.toString() || "",
        contact: formData.get("contact")?.toString() || "",
        bin: formData.get("bin")?.toString() || "",
      }
    };
  }

  const { name, address, manager, contact, bin } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("offices");

    await collection.insertOne({
      office_name: name,
      address,
      manager,
      contact,
      bin,
      created_at: new Date(),
    });

    revalidatePath("/dashboard/offices");
    return { message: "Office created successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Create Office." };
  }
}

const UpdateOffice = OfficeFormSchema.omit({ id: true, date: true });
export async function updateOffice(
  id: string,
  prevState: OfficeState,
  formData: FormData
) {
  const validatedFields = UpdateOffice.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    manager: formData.get("manager"),
    contact: formData.get("contact"),
    bin: formData.get("bin"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Office.",
      values: {
        name: formData.get("name")?.toString() || "",
        address: formData.get("address")?.toString() || "",
        manager: formData.get("manager")?.toString() || "",
        contact: formData.get("contact")?.toString() || "",
        bin: formData.get("bin")?.toString() || "",
      }
    };
  }

  const { name, address, manager, contact, bin } = validatedFields.data;
  console.log(id, name, address, manager, contact, bin)

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("offices");

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          office_name: name,
          address,
          manager,
          contact,
          bin,
        },
      }
    );

    revalidatePath("/dashboard/offices");
    return { message: "Office edited successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Update Office." };
  }
}

export async function deleteOffice(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("offices");

    await collection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/dashboard/offices");
    return { message: "Deleted office." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Delete Office." };
  }
}

// ticket actions
const PurchaseTicket = PurchaseTicketFormSchema.omit({ id: true, date: true });
export async function purchaseTicket(prevState: PurchaseTicketState, formData: FormData) {
  const validatedFields = PurchaseTicket.safeParse({
    purchase_date: formData.get("purchase_date"),
    airline: formData.get("airline"),
    route: formData.get("route"),
    pnr: formData.get("pnr"),
    pax: formData.get("pax"),
    ticket_price: formData.get("ticket_price"),
    selling_price: formData.get("selling_price"),
    is_umrah: formData.get("is_umrah") === "on",
  });

  if (!validatedFields.success) {
    console.log("error:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Office.",
      values: {
        purchase_date: formData.get("purchase_date")?.toString() || "",
        airline: formData.get("airline")?.toString() || "",
        route: formData.get("route")?.toString() || "",
        pnr: formData.get("pnr")?.toString() || "",
        pax: formData.get("pax")?.toString() || "",
        ticket_price: formData.get("ticket_price")?.toString() || "",
        selling_price: formData.get("selling_price")?.toString() || "",
        is_umrah: formData.get("is_umrah") === "on",
      }
    };
  }

  const { purchase_date, airline, route, pnr, pax, ticket_price, selling_price, is_umrah } = validatedFields.data;

  try {
    const session = await auth();
    let userInfo = null;
    if (session?.user?.email) {
      userInfo = await getUser(session.user.email);
    }
    const created_by = userInfo?.name || "system";

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("pnrs");

    await collection.insertOne({
      purchase_date, 
      airline, 
      route, 
      pnr, 
      pax, 
      ticket_price, 
      selling_price,
      sold: false,
      available: pax,
      is_umrah,
      created_at: new Date(),
      created_by: created_by
    });

    revalidatePath("/dashboard/purchase");
    return { message: "Tickets purchased successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Purchase Tickets." };
  }
}

export async function sellTicket(prevState: SellTicketState, formData: FormData): Promise<SellTicketState> {
  const validated = SellTicketSchema.safeParse({
    passengers: formData.get("passengers"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Missing or invalid passenger data.",
    };
  }

  try {
    const passengers = JSON.parse(validated.data.passengers);

    if (!Array.isArray(passengers) || passengers.length === 0) {
      return { message: "No passenger provided." };
    }

    const session = await auth();
    const userInfo = session?.user?.email
      ? await getUser(session.user.email)
      : null;
    const sold_by = userInfo?.name || "system";

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const passengersCollection = db.collection("passengers");
    const ticketsCollection = db.collection("pnrs");
    const salesCollection = db.collection("sales");

    const bulkTicketUpdates = new Map<string, number>();

    for (const p of passengers) {
      const ticketId = p.ticket.id;
      bulkTicketUpdates.set(ticketId, (bulkTicketUpdates.get(ticketId) || 0) + 1);
    }

    // 1. Insert passengers
    const insertedPassengers = await passengersCollection.insertMany(
      passengers.map((p) => ({
        name: p.name,
        passport_no: p.passport_no,
        ticket_id: p.ticket.id,
        route: p.ticket.route,
        pnr: p.ticket.pnr,
        due_amount: p.ticket.selling_price - p.amount,
        created_at: new Date(),
        sold_by: sold_by,
      }))
    );

    // 2. Update tickets availability
    for (const [ticketId, count] of bulkTicketUpdates) {
      await ticketsCollection.updateOne(
        { _id: new ObjectId(ticketId), available: { $gte: count } },
        { $inc: { available: -count } }
      );
    }

    // 3. Insert sales record
    await salesCollection.insertOne({
      sold_by,
      date: new Date(),
      passenger_count: passengers.length,
      ticket_ids: [...bulkTicketUpdates.keys()],
      passenger_ids: Object.values(insertedPassengers.insertedIds),
    });

    revalidatePath("/dashboard/sell");
    return { message: "Tickets sold successfully." };
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to sell tickets." };
  }
}

export async function makeUmrahGroup(
  prevState: UmrahGroupState,
  formData: FormData
): Promise<UmrahGroupState> {
  const validatedFields = UmrahGroupFormSchema.safeParse({
    groupType: formData.get("group_type"),
    groupMonth: formData.get("group_month")?.toString(),
    groupId: formData.get("group_id")?.toString(),
    ticketIds: formData.getAll("ticketIds") as string[],
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Group creation aborted.",
    };
  }

  const { groupType, groupMonth, groupId, ticketIds } = validatedFields.data;

  try {
    const session = await auth();
    const user = session?.user?.email ? await getUser(session.user.email) : null;
    const created_by = user?.name || "system";

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const groupCollection = db.collection("umrah_groups");
    const pnrCollection = db.collection("pnrs");

    if (groupType === "new") {
      if (!groupMonth) return { message: "Group month is required." };

      const count = await groupCollection.countDocuments({ month: groupMonth });

      const date = new Date(groupMonth + "-01");
      const prefix = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      }).toLowerCase().replace(" ", ""); // e.g. "jul25"

      const name = `${prefix}-g${count + 1}`;

      const newGroup = {
        name,
        month: groupMonth,
        pnr_list: ticketIds,
        created_by,
        created_at: new Date(),
      };

      const result = await groupCollection.insertOne(newGroup);
      const groupObjectId = result.insertedId;

      // Update pnrs to include this umrah group ID
      await pnrCollection.updateMany(
        { _id: { $in: ticketIds.map((id) => new ObjectId(id)) } },
        { $set: { umrah_group_id: groupObjectId, is_umrah: true } }
      );

      return { status: "success", message: "Group assignment successful." };
    }

    if (groupType === "existing") {
      if (!groupId) return { message: "Group ID is required." };

      const groupObjectId = new ObjectId(groupId);

      await groupCollection.updateOne(
        { _id: groupObjectId },
        { $addToSet: { pnr_list: { $each: ticketIds } } }
      );

      await pnrCollection.updateMany(
        { _id: { $in: ticketIds.map((id) => new ObjectId(id)) } },
        { $set: { umrah_group_id: groupObjectId, is_umrah: true } }
      );

      return { status: "success", message: "Group assignment successful." };
    }

    return { message: "Invalid group type." };
  } catch (error) {
    console.error("Error in makeUmrahGroup:", error);
    return { message: "Server error occurred." };
  }
}






// authentication
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
