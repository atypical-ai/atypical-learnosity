"use client";

import { useState, useEffect, useCallback } from "react";
import Script from "next/script";

// slide over panel imports
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export enum ScriptState {
  IDLE = "idle",
  LOADING = "loading",
  READY = "ready",
  ERROR = "error",
}

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

export const LearnosityInlinePrototype = () => {
  // Script loading state
  const [status, setStatus] = useState<ScriptState>(ScriptState.IDLE);

  // On mount, get the Learnosity credentials
  useEffect(() => {
    getLearnosityCredentials().catch(console.error);
  }, []);

  const [credentials, setCredentials] = useState(null);
  const getLearnosityCredentials = async () => {
    const response = await fetch("/api/learnosity");
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    // Store the credentials for later
    setCredentials(body);
  };

  // When the script is ready and we have credentials, load the application
  useEffect(() => {
    if (status === ScriptState.READY && credentials) {
      console.log("STATUS:", status);
      console.log("CREDENTIALS", credentials);
      loadApplicationWithCredentials(credentials);
    }
  }, [status, credentials]);

  const loadApplicationWithCredentials = (credentials: any) => {
    if (typeof window.LearnosityItems != "undefined") {
      window.LearnosityItems.init(credentials, {
        readyListener() {
          console.log("👍🏼 <<< Learnosity Items API is ready >>> 🧘🏼");
        },
        errorListener(err: Error) {
          console.log("error", err);
        },
      });
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [itemsToEdit, setItemsToEdit] = useState<
    { id: string; reference: string }[]
  >([]);
  const handleEdit = (itemReference: { id: string; reference: string }) => {
    setItemsToEdit([itemReference]);
    setIsEditing(true);
  };

  return (
    <div className="mt-20 size-full overflow-auto rounded-md bg-white p-4">
      <Script
        id="learnosity"
        src="//items.learnosity.com/?v2022.1.LTS"
        onLoad={() => {
          setStatus(ScriptState.LOADING);
        }}
        onError={() => {
          setStatus(ScriptState.ERROR);
        }}
        onReady={() => {
          setStatus(ScriptState.READY);
        }}
        strategy="lazyOnload"
      />

      <div>status: {status}</div>

      {itemReferences?.map((itemReference) => {
        return (
          <div key={itemReference.reference}>
            <span
              data-reference={itemReference.reference}
              className="learnosity-item flex"
            >
              {/* Learnosity Items UI here */}
            </span>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => handleEdit(itemReference)}
            >
              Edit
            </button>
          </div>
        );
      })}
      {isEditing ? (
        <SlideOver
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          itemReferences={itemsToEdit}
        />
      ) : null}
    </div>
  );
};

export default function SlideOver({
  isEditing = false,
  setIsEditing,
  itemReferences,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  itemReferences: { id: string; reference: string }[];
}) {
  const [status, setStatus] = useState<ScriptState>(ScriptState.IDLE);

  const [credentials, setCredentials] = useState(null);
  const getLearnosityCredentials = useCallback(async () => {
    const response = await fetch("/api/learnosity", {
      method: "POST",
      body: JSON.stringify({ itemReferences }),
    });
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    console.log("body", { body });
    // Store the credentials for later
    setCredentials(body);
  }, [itemReferences]);

    // On mount, get the Learnosity credentials
    useEffect(() => {
      getLearnosityCredentials().catch(console.error);
    }, [getLearnosityCredentials]);


  // When the script is ready and we have credentials, load the application
  useEffect(() => {
    if (status === ScriptState.READY && credentials) {
      console.log("STATUS:", status);
      console.log("CREDENTIALS", credentials);
      loadApplicationWithCredentials(credentials);
    }
  }, [status, credentials]);

  const [authorApp, setAuthorApp] = useState<any>(null);
  const loadApplicationWithCredentials = (credentials: any) => {
    if (typeof window.LearnosityAuthor != "undefined") {
      const authorApp = window.LearnosityAuthor.init(
        credentials,
        {
          readyListener: function () {
            console.log("Learnosity Author API is ready");
          },
          errorListener: function (err: any) {
            console.log("Error Loading Learnosity AuthorAPI", { err });
          },
        },
        "learnosity-author"
      );
      console.log({ authorApp });
      setAuthorApp(authorApp);
    }
  };

  return (
    <Transition.Root show={isEditing} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsEditing}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Script
                id="learnosity-author"
                src="https://authorapi.learnosity.com?v2024.1.LTS"
                onLoad={() => {
                  setStatus(ScriptState.LOADING);
                }}
                onError={() => {
                  setStatus(ScriptState.ERROR);
                }}
                onReady={() => {
                  setStatus(ScriptState.READY);
                }}
                strategy="lazyOnload"
              />

              <div>status: {status}</div>
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Edit item
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setIsEditing(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div id="learnosity-author">
                      {/* Learnosity Author UI here */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
