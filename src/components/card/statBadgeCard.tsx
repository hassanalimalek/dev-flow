import Image from "next/image";
import React from "react";

function StatBadgeCard({ image, title, value }: any) {
  return (
    <div className="bg-gradient background-light800_dark400 py-5 px-7 flex justify-start flex-auto  ">
      <div className="flex gap-2 justify-start text-left ">
        <Image src={image} width="30" height="30" alt="badge image" />
        <div className="flex flex-col">
          <p>{value}</p>
          <p className="text-dark200_light900 body-regular ">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default StatBadgeCard;
