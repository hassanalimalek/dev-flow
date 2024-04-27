import Image from "next/image";
import Link from "next/link";
import React from "react";
import moment from "moment";
import { getJoinedDate } from "@/lib/utils";

function ProfileCardHeader({ data }: any) {
  return (
    <>
      <div className="flex flex-1 gap-6">
        <Link href={`/profile/${data.user?.clerkId}`}>
          <Image
            src={data.user?.picture}
            alt={data.user?.name}
            width={100}
            height={100}
            className="rounded-full"
          />
        </Link>
        <div className="flex flex-1  justify-between">
          <div className="">
            <h3 className="h3-bold text-dark200_light900 mb-1">
              {data.user?.name}
            </h3>
            <p className=" body-regular text-dark200_light900 mb-4">
              @{data.user?.email}
            </p>
            <div className="flex gap-6">
              <div className="flex gap-1">
                <Image
                  src="/assets/icons/link.svg"
                  alt=""
                  width={15}
                  height={15}
                />
                <p className=" body-regular text-dark200_light900 link">
                  {data.user?.username}
                </p>
              </div>
              <div className="flex gap-1">
                <Image
                  src="/assets/icons/location.svg"
                  alt=""
                  width={15}
                  height={15}
                />
                <p className=" body-regular text-dark200_light900 link">
                  {data.user?.username}
                </p>
              </div>
              <div className="flex gap-1">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt=""
                  width={15}
                  height={15}
                />
                <p className=" body-regular text-dark200_light900 link">
                  {getJoinedDate(data.user?.joinedAt)}
                </p>
              </div>
            </div>
            <p className="mt-6 body-regular">Profile Description</p>
          </div>
          <div>
            <Link href={`/profile/edit`}>
              <button className="px-6 py-3 btn-secondary rounded body-regular text-dark200_light900">
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileCardHeader;
