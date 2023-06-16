import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../database/database";

export async function GET(request: NextRequest) {
  console.log("GET Request to /availability");
  try {
    // console.log(request.url);
    const { searchParams } = new URL(request.url);
    // console.log("searchParams:", searchParams);
    // console.log("searchParams.size:", searchParams.size);
    const queryDay = searchParams.get("day");
    // console.log("queryDay:", queryDay);
    const queryTimeslot = searchParams.get("timeslot");
    // console.log("queryTimeSlot:", queryTimeslot);

    if (searchParams.size > 0 && queryDay && queryTimeslot) {
      const client = await pool.connect();
      const query = await client.query(
        `
        SELECT *
        FROM availability
        WHERE day_string = $1
        AND timeslot_string = $2
        ORDER BY timeslot_id;
        `,
        [queryDay, queryTimeslot]
      );
      const data = query.rows;
      client.release();
      console.log("GET Success");
      return NextResponse.json(data);
    }

    if (searchParams.size > 0 && queryDay) {
      const client = await pool.connect();
      const query = await client.query(
        `
        SELECT *
        FROM availability
        WHERE day_string = $1
        ORDER BY timeslot_id;
        `,
        [queryDay]
      );
      const data = query.rows;
      client.release();
      console.log("GET Success");
      return NextResponse.json(data);
    }

    if (searchParams.size === 0) {
      const client = await pool.connect();
      const query = await client.query(
        `
        SELECT * 
        FROM availability 
        ORDER BY timeslot_id;
        `
      );
      const data = query.rows;
      client.release();
      console.log("GET Success");
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json("error");
  }
}

export async function PUT(request: NextRequest) {
  console.log("PUT Request to /availability");
  try {
    const requestBody = await request.json();
    const { daystring, timeslotstring, name } = requestBody;
    const client = await pool.connect();
    const query = await client.query(
      `
      UPDATE availability
      SET available_${name} = NOT available_${name}
      WHERE day_string = $1
      AND timeslot_string = $2
      RETURNING *`,
      [daystring, timeslotstring]
    );
    const data = query.rows;
    client.release();
    console.log("PUT Success");
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json("error");
  }
}
