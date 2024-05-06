/* eslint-disable camelcase */

import Image from "next/image";

interface JobLocationProps {
  job_country?: string;
  job_city?: string;
  job_state?: string;
  country_code?: string;
}

export const JobLocation = ({
  job_country,
  job_city,
  job_state,
  country_code,
}: JobLocationProps) => {
  return (
    <div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
      {country_code && (
        <Image
          src={`https://flagsapi.com/${country_code}/flat/64.png`}
          alt="country symbol"
          width={16}
          height={16}
          className="rounded-full"
        />
      )}

      <p className="body-medium text-dark400_light700">
        {job_city && `${job_city}, `}
        {job_state && `${job_state}, `}
        {job_country && `${job_country}`}
      </p>
    </div>
  );
};
