import React from "react";

function StatCard({ data }: any) {
  return (
    <div className="bg-gradient background-light800_dark400 py-5 px-7 flex justify-between flex-auto gap-4 text-left">
      {data?.map((item: any) => {
        return (
          <div
            key={item.title}
            className="flex flex-col  justify-start text-left "
          >
            <p className="text-dark200_light900 font-semibold">{item.value}</p>
            <p className="text-dark200_light900 body-regular ">{item?.title}</p>
          </div>
        );
      })}
    </div>
  );
}

export default StatCard;
