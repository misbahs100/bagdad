
import clientPromise from './db/mongodb';
import { ObjectId } from 'mongodb';

// dashboard queries

// other queries

const ITEMS_PER_PAGE = 20;

// system data queries
export async function fetchSystemData() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("system-data");

    const data = await collection.find({}).toArray();

    // Convert `_id` to string
    return data.map(dt => ({
      name: dt.name,
      description: dt.description,
      themeColor: dt.themeColor,
      logo: dt.logo,
      id: dt._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch system data.");
  }
}

// users queries
export async function fetchUsersPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("users");

    const count = await collection.countDocuments({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { contact: { $regex: query, $options: "i" } },
        { user_role: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of users.");
  }
}

export async function fetchFilteredUsers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("users");

    const users = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { contact: { $regex: query, $options: "i" } },
          { user_role: { $regex: query, $options: "i" } },
          { address: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return users.map(user => ({
      name: user.name,
      user_role: user.user_role,
      email: user.email,
      contact: user.contact,
      address: user.address,
      image_url: user.image_url,
      id: user._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users.");
  }
}

export async function fetchUserById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("users");


    //
    const fetched_user = await collection.findOne({ _id: new ObjectId(id) });

    if (!fetched_user) {
      throw new Error("User not found.");
    }

    const user = {
      name: fetched_user.name,
      user_role: fetched_user.user_role,
      email: fetched_user.email,
      contact: fetched_user.contact,
      address: fetched_user.address,
      image_url: fetched_user.image_url,
      id: fetched_user._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    };

    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

// offices queries
export async function fetchOfficesPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("offices");

    const count = await collection.countDocuments({
      $or: [
        { office_name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { contact: { $regex: query, $options: "i" } },
        { manager: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
        { bin: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of offices.");
  }
}

export async function fetchOffices() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("offices");

    const offices = await collection.find({}).toArray();

    // Convert `_id` to string
    return offices.map(office => ({
      office_name: office.office_name,
      address: office.address,
      contact: office.contact,
      manager: office.manager,
      bin: office.bin,
      id: office._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch offices.");
  }
}

export async function fetchFilteredOffices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("offices");

    const offices = await collection
      .find({
        $or: [
          { office_name: { $regex: query, $options: "i" } },
          { address: { $regex: query, $options: "i" } },
          { contact: { $regex: query, $options: "i" } },
          { manager: { $regex: query, $options: "i" } },
          { code: { $regex: query, $options: "i" } },
          { bin: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ office_name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return offices.map(office => ({
      office_name: office.office_name,
      address: office.address,
      contact: office.contact,
      manager: office.manager,
      bin: office.bin,
      id: office._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch offices.");
  }
}

export async function fetchOfficeById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("offices");

    const fetched_office = await collection.findOne({ _id: new ObjectId(id) });

    if (!fetched_office) {
      throw new Error("Office not found.");
    }

    const office = {
      office_name: fetched_office.office_name,
      address: fetched_office.address,
      contact: fetched_office.contact,
      manager: fetched_office.manager,
      bin: fetched_office.bin,
      code: fetched_office.code,
      id: fetched_office._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    };

    return office;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch office.");
  }
}

// tickets queries
export async function fetchFilteredTickets(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("pnrs");

    const tickets = await collection
      .find({
        $or: [
          { purchase_date: { $regex: query, $options: "i" } },
          { airline: { $regex: query, $options: "i" } },
          { route: { $regex: query, $options: "i" } },
          { pnr: { $regex: query, $options: "i" } },
          { pax: { $regex: query, $options: "i" } },
          { ticket_price: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ purchase_date: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return tickets.map(tkt => ({
      purchase_date: tkt.purchase_date,
      airline: tkt.airline,
      route: tkt.route,
      pnr: tkt.pnr,
      pax: tkt.pax,
      ticket_price: tkt.ticket_price,
      selling_price: tkt.selling_price,
      sold: tkt?.sold,
      available: tkt.available,
      is_umrah: tkt.is_umrah,
      umrah_group_id: tkt?.umrah_group_id ? tkt.umrah_group_id.toString() : null,
      id: tkt._id.toString(), 
      _id: undefined, 
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch tickets.");
  }
}

export async function fetchTicketsPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("pnrs");

    const count = await collection.countDocuments({
      $or: [
        { purchase_date: { $regex: query, $options: "i" } },
          { airline: { $regex: query, $options: "i" } },
          { route: { $regex: query, $options: "i" } },
          { pnr: { $regex: query, $options: "i" } },
          { pax: { $regex: query, $options: "i" } },
          { ticket_price: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of pnrs/tickets.");
  }
}

// umrah_groups queries
export async function fetchAllUmrahGroups() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("umrah_groups");

    const groups = await collection.find({}).sort({ month: -1 }).toArray();

    // Convert `_id` to string
    return groups.map(group => ({
      name: group.name,
      month: group.month,
      pnr_list: group.pnr_list,
      created_by: group.created_by,
      created_at: group.created_at,
      id: group._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch groups.");
  }
}

export async function fetchFilteredUmrahGroups(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const groupCollection = db.collection("umrah_groups");
    const pnrCollection = db.collection("pnrs");

    const groups = await groupCollection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { month: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ month: -1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    // Map each group's pnr_list to real documents
    const result = await Promise.all(
      groups.map(async (group) => {
        const pnrDocs = await pnrCollection
          .find({
            _id: {
              $in: group.pnr_list.map((id: string | ObjectId) =>
                typeof id === "string" ? new ObjectId(id) : id
              ),
            },
          })
          .project({
            _id: 0,
            id: { $toString: "$_id" },
            route: 1,
            airline: 1,
            purchase_date: 1,
            pnr: 1,
            pax: 1,
            available: 1,
            ticket_price: 1,
            selling_price: 1,
            sold: 1,
            is_umrah: 1,
          })
          .toArray();

        return {
          name: group.name,
          month: group.month,
          created_by: group.created_by,
          created_at: group.created_at,
          id: group._id.toString(),
          pnr_list: pnrDocs, // full info
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Umrah groups.");
  }
}

// sales queries
// export async function fetchFilteredSales(query: string, currentPage: number) {
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const client = await clientPromise;
//     const db = client.db(process.env.MONGODB_DB);

//     const salesCollection = db.collection("sales");
//     const pnrCollection = db.collection("pnrs");
//     const passengerCollection = db.collection("passengers");

//     const sales = await salesCollection
//       .find({
//         $or: [
//           { sold_by: { $regex: query, $options: "i" } },
//           { date: { $regex: query, $options: "i" } },
//           // you can later add passport_no or passenger name filter via aggregation if needed
//         ],
//       })
//       .sort({ date: -1 })
//       .skip(offset)
//       .limit(ITEMS_PER_PAGE)
//       .toArray();

//     const result = await Promise.all(
//       sales.map(async (sale) => {
//         // Fetch PNR Info
//         const pnrDocs = await pnrCollection
//           .find({
//             _id: {
//               $in: sale.ticket_ids.map((id: string | ObjectId) =>
//                 typeof id === "string" ? new ObjectId(id) : id
//               ),
//             },
//           })
//           .project({
//             _id: 0,
//             id: { $toString: "$_id" },
//             route: 1,
//             airline: 1,
//             purchase_date: 1,
//             pnr: 1,
//             pax: 1,
//             available: 1,
//             ticket_price: 1,
//             sold: 1,
//             is_umrah: 1,
//           })
//           .toArray();

//         // Fetch Passenger Info
//         const passengerDocs = await passengerCollection
//           .find({
//             _id: {
//               $in: sale.passenger_ids.map((id: string | ObjectId) =>
//                 typeof id === "string" ? new ObjectId(id) : id
//               ),
//             },
//           })
//           .project({
//             _id: 0,
//             id: { $toString: "$_id" },
//             name: 1,
//             passport_no: 1,
//             // nationality: 1,
//             // gender: 1,
//             // phone: 1,
//             // dob: 1,
//           })
//           .toArray();

//         return {
//           id: sale._id.toString(),
//           sold_by: sale.sold_by,
//           date: sale.date,
//           passenger_count: sale.passenger_count,
//           pnr_list: pnrDocs,
//           passenger_list: passengerDocs,
//         };
//       })
//     );

//     return result;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch sales information.");
//   }
// }
export async function fetchFilteredSales(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const salesCollection = db.collection("sales");
    const pnrCollection = db.collection("pnrs");
    const passengerCollection = db.collection("passengers");

    const pipeline = [
      {
        $addFields: {
          ticket_ids_obj: {
            $map: {
              input: "$ticket_ids",
              as: "id",
              in: { $toObjectId: "$$id" },
            },
          },
        },
      },
      {
        $addFields: {
          passenger_ids_obj: {
            $map: {
              input: "$passenger_ids",
              as: "id",
              in: { $toObjectId: "$$id" },
            },
          },
        },
      },
      // Lookup pnrs
      {
        $lookup: {
          from: "pnrs",
          localField: "ticket_ids_obj",
          foreignField: "_id",
          as: "pnr_list",
        },
      },
      // Lookup passengers
      {
        $lookup: {
          from: "passengers",
          localField: "passenger_ids_obj",
          foreignField: "_id",
          as: "passenger_list",
        },
      },
      // Add fields for string search
      {
        $addFields: {
          pnr_str: {
            $reduce: {
              input: "$pnr_list",
              initialValue: "",
              in: { $concat: ["$$value", " ", "$$this.pnr"] },
            },
          },
          passenger_str: {
            $reduce: {
              input: "$passenger_list",
              initialValue: "",
              in: {
                $concat: [
                  "$$value",
                  " ",
                  "$$this.name",
                  " ",
                  "$$this.passport_no",
                ],
              },
            },
          },
        },
      },
      // Match against query
      {
        $match: {
          $or: [
            { sold_by: { $regex: query, $options: "i" } },
            { date: { $regex: query, $options: "i" } },
            { pnr_str: { $regex: query, $options: "i" } },
            { passenger_str: { $regex: query, $options: "i" } },
          ],
        },
      },
      { $sort: { date: -1 } },
      { $skip: offset },
      { $limit: ITEMS_PER_PAGE },
    ];

    const sales = await salesCollection.aggregate(pipeline).toArray();




    const result = await Promise.all(
      sales.map(async (sale) => {
        // Fetch PNR Info
        const pnrDocs = await pnrCollection
          .find({
            _id: {
              $in: sale.ticket_ids.map((id: string | ObjectId) =>
                typeof id === "string" ? new ObjectId(id) : id
              ),
            },
          })
          .project({
            _id: 0,
            id: { $toString: "$_id" },
            route: 1,
            airline: 1,
            purchase_date: 1,
            pnr: 1,
            pax: 1,
            available: 1,
            ticket_price: 1,
            selling_price: 1,
            sold: 1,
            is_umrah: 1,
          })
          .toArray();

        // Fetch Passenger Info
        const passengerDocs = await passengerCollection
          .find({
            _id: {
              $in: sale.passenger_ids.map((id: string | ObjectId) =>
                typeof id === "string" ? new ObjectId(id) : id
              ),
            },
          })
          .project({
            _id: 0,
            id: { $toString: "$_id" },
            name: 1,
            passport_no: 1,
            due_amount: 1,
            // nationality: 1,
            // gender: 1,
            // phone: 1,
            // dob: 1,
          })
          .toArray();

        return {
          id: sale._id.toString(),
          sold_by: sale.sold_by,
          date: sale.date,
          passenger_count: sale.passenger_count,
          pnr_list: pnrDocs,
          passenger_list: passengerDocs,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch sales information.");
  }
}

export async function fetchSalesPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const salesCollection = db.collection("sales");

    const pipeline = [
      // Lookup pnrs
      {
        $lookup: {
          from: "pnrs",
          localField: "ticket_ids",
          foreignField: "_id",
          as: "pnr_list",
        },
      },
      // Lookup passengers
      {
        $lookup: {
          from: "passengers",
          localField: "passenger_ids",
          foreignField: "_id",
          as: "passenger_list",
        },
      },
      // Add search-friendly strings
      {
        $addFields: {
          pnr_str: {
            $reduce: {
              input: "$pnr_list",
              initialValue: "",
              in: { $concat: ["$$value", " ", "$$this.pnr"] },
            },
          },
          passenger_str: {
            $reduce: {
              input: "$passenger_list",
              initialValue: "",
              in: {
                $concat: [
                  "$$value",
                  " ",
                  "$$this.name",
                  " ",
                  "$$this.passport_no",
                ],
              },
            },
          },
        },
      },
      // Match with search query
      {
        $match: {
          $or: [
            { sold_by: { $regex: query, $options: "i" } },
            { date: { $regex: query, $options: "i" } },
            { pnr_str: { $regex: query, $options: "i" } },
            { passenger_str: { $regex: query, $options: "i" } },
          ],
        },
      },
      // Count the matched documents
      { $count: "total" },
    ];

    const countResult = await salesCollection.aggregate(pipeline).toArray();
    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to calculate total sales pages.");
  }
}

// passenger queries
export async function fetchFilteredPassengers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const passengersCollection = db.collection("passengers");

    const pipeline = [
      // Convert ticket_id to ObjectId
      {
        $addFields: {
          ticket_id_obj: {
            $cond: {
              if: { $eq: [{ $type: "$ticket_id" }, "string"] },
              then: { $toObjectId: "$ticket_id" },
              else: "$ticket_id",
            },
          },
        },
      },

      // Lookup PNR info
      {
        $lookup: {
          from: "pnrs",
          localField: "ticket_id_obj",
          foreignField: "_id",
          as: "pnr_info",
        },
      },

      // Lookup sales info (reverse lookup: passenger_ids includes this passenger._id)
      {
        $lookup: {
          from: "sales",
          let: { passengerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$passengerId", "$passenger_ids"] },
              },
            },
            {
              $project: {
                _id: 0,
                sale_id: { $toString: "$_id" },
                sold_by: 1,
                date: 1,
              },
            },
          ],
          as: "sale_info",
        },
      },

      // Add searchable fields
      {
        $addFields: {
          pnr_str: { $arrayElemAt: ["$pnr_info.pnr", 0] },
          airline_str: { $arrayElemAt: ["$pnr_info.airline", 0] },
        },
      },

      // Search filter
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { passport_no: { $regex: query, $options: "i" } },
            { route: { $regex: query, $options: "i" } },
            { pnr_str: { $regex: query, $options: "i" } },
            { airline_str: { $regex: query, $options: "i" } },
          ],
        },
      },

      // Final cleanup
      { $sort: { created_at: -1 } },
      { $skip: offset },
      { $limit: ITEMS_PER_PAGE },

      // Project desired structure
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          name: 1,
          passport_no: 1,
          route: 1,
          due_amount: 1,
          created_at: 1,
          sold_by: 1,
          ticket_id: { $toString: "$ticket_id_obj" },
          pnr_info: {
            $arrayElemAt: ["$pnr_info", 0],
          },
          sale_info: {
            $arrayElemAt: ["$sale_info", 0],
          },
        },
      },
    ];

    const passengers = await passengersCollection.aggregate(pipeline).toArray();
    return passengers;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch passenger data.");
  }
}

export async function fetchPassengersPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const passengerCollection = db.collection("passengers");

    const pipeline = [
      {
        $addFields: {
          ticket_id_obj: {
            $cond: {
              if: { $eq: [{ $type: "$ticket_id" }, "string"] },
              then: { $toObjectId: "$ticket_id" },
              else: "$ticket_id",
            },
          },
        },
      },

      // Lookup PNR info
      {
        $lookup: {
          from: "pnrs",
          localField: "ticket_id_obj",
          foreignField: "_id",
          as: "pnr_info",
        },
      },
      {
        $unwind: {
          path: "$pnr_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup Sale info
      {
        $lookup: {
          from: "sales",
          let: { pid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$pid", "$passenger_ids"],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "sale_info",
        },
      },
      {
        $unwind: {
          path: "$sale_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Add searchable string
      {
        $addFields: {
          search_text: {
            $concat: [
              "$name", " ",
              "$passport_no", " ",
              "$pnr", " ",
              "$route", " ",
              "$pnr_info.pnr", " ",
              "$pnr_info.route", " ",
              "$pnr_info.airline", " ",
              "$sold_by"
            ],
          },
        },
      },
      // Match query
      {
        $match: {
          search_text: { $regex: query, $options: "i" },
        },
      },
      // Count total documents matching filter
      {
        $count: "total",
      },
    ];

    const result = await passengerCollection.aggregate(pipeline).toArray();
    const total = result[0]?.total || 0;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of passenger pages.");
  }
}







