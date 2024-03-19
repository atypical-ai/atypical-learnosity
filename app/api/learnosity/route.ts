import Learnosity, { Security, Request } from "learnosity-sdk-nodejs"; // Include Learnosity SDK constructor
import { NextRequest, NextResponse } from "next/server";
import * as uuid from "uuid";
import { text } from "stream/consumers";

const user_id = uuid.v4();
export function buildInitialRequest({
  itemReferences,
}: {
  itemReferences?: { reference: string; id: string }[];
}) {
  const session_id = uuid.v4();
  return {
    activity_id: "react_sdk_primer_activity",
    name: "A Learnosity React Demo",
    user_id: user_id,
    session_id: session_id,
    rendering_type: "inline",
    type: "submit_practice",
    // state: "initial",
    items: [...(itemReferences || [])],
  };
}

export async function GET(request: NextRequest) {
  // hard coded for initialization
  const itemReferences = [
    {
      reference: "react_01",
      id: "react_01",
    },
    {
      reference: "react_02",
      id: "react_02",
    },
    {
      reference: "react_03",
      id: "react_03",
    },
    {
      reference: "react_04",
      id: "react_04",
    },
    {
      reference: "react_05",
      id: "react_05",
    },
    {
      reference: "react_06",
      id: "react_06",
    },
    {
      reference: "react_07",
      id: "react_07",
    },
    {
      reference: "react_08",
      id: "react_08",
    },
    {
      reference: "react_09",
      id: "react_09",
    },
    {
      reference: "react_10",
      id: "react_10",
    },
    {
      reference: "react_11",
      id: "react_11",
    },
    {
      reference: "react_12",
      id: "react_12",
    },
  ];
  // - - - - - - Learnosity's server-side configuration - - - - - - //
  const learnositySdk = new Learnosity();
  const security: Security = {
    consumer_key: process.env.LEARNOSITY_CONSUMER_KEY || "",
    domain: request.nextUrl.hostname,
  };
  const secret: string = process.env.LEARNOSITY_SECRET || "";
  const initializationRequest: Request = buildInitialRequest({
    itemReferences,
  });

  // exclude the action parameter: action parameter appears to trigger 403 error
  const lrRequest = learnositySdk.init(
    "items",
    security,
    secret,
    initializationRequest
  );
  return NextResponse.json(lrRequest);
}

export async function POST(request: NextRequest) {
  // get the itemReferences from the request body
  const bodyText = await text(request.body);
  const { itemReferences } = JSON.parse(bodyText);
  // - - - - - - Learnosity's server-side configuration - - - - - - //
  const learnositySdk = new Learnosity();
  const security = {
    consumer_key: process.env.LEARNOSITY_CONSUMER_KEY || "",
    domain: "localhost",
    user_id: user_id,
  };
  const secret: string = process.env.LEARNOSITY_SECRET || "";

  const initializationObject = {
    mode: "item_edit",
    reference: itemReferences[0].reference,
    user: { id: "123" },
    config: {
      // item_edit: {
      //   settings: {
      //     show: false,
      //   },
      //   widget: {
      //     edit: true,
      //     delete: false,
      //   },
      //   item: {
      //     save: false,
      //     reference: {
      //       show: true,
      //       edit: true,
      //     },
      //     mode: {
      //       show: false,
      //     },
      //   },
      // },
      item_edit: {
        item: {
          reference: {
            show: true,
          },
        },
      },
    },
  };

  const lrRequest = learnositySdk.init(
    "author",
    security,
    secret,
    initializationObject
  );
  return NextResponse.json(lrRequest);
}
