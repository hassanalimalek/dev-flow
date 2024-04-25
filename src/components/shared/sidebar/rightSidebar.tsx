import Image from "next/image";
import React from "react";
import RenderTag from "../renderTag";

function RightSidebar() {
  return (
    <div
      className="
  background-light900_dark200 light-border flex flex-col    p-6 pt-36 shadow-light-300 dark:shadow-none max-md:hidden md:w-[320px]"
    >
      <div className="mb-20">
        <h2 className="h3-bold text-dark300_light900 ">Top Questions</h2>
        <div className="mt-6 flex flex-col gap-[30px]">
          <div className="flex gap-4">
            <p className="body-medium text-dark500_light700">
              Would it be appropriate to point out an error in another paper
              during a referee report?
            </p>
            <Image
              alt="chevron right"
              width={20}
              height={20}
              src="assets/icons/chevron-right.svg"
            />
          </div>
          <div className="flex gap-4">
            <p className="body-medium text-dark500_light700">
              Would it be appropriate to point out an error in another paper
              during a referee report?
            </p>
            <Image
              alt="chevron right"
              width={20}
              height={20}
              src="assets/icons/chevron-right.svg"
            />
          </div>
          <div className="flex gap-4">
            <p className="body-medium text-dark500_light700">
              Would it be appropriate to point out an error in another paper
              during a referee report?
            </p>
            <Image
              alt="chevron right"
              width={20}
              height={20}
              src="assets/icons/chevron-right.svg"
            />
          </div>
          <div className="flex gap-4">
            <p className="body-medium text-dark500_light700">
              Would it be appropriate to point out an error in another paper
              during a referee report?
            </p>
            <Image
              alt="chevron right"
              width={20}
              height={20}
              src="assets/icons/chevron-right.svg"
            />
          </div>
        </div>
      </div>
      <div>
        <h2 className="h3-bold text-dark300_light900 ">Popular Tags</h2>
        <div className="mt-6 flex flex-col gap-[30px]">
          <RenderTag
            _id="1"
            name="NEXT JS"
            showCount={true}
            totalQuestions={1000}
          />
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
