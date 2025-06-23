import Link from "next/link";
import React from "react";

function page() {
  return (
    <Link href={"/api//bg-remove"}>
      <div className="card bg-neutral text-neutral-content w-96">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Backgroud Removal </h2>
        </div>
      </div>
    </Link>
  );
}

export default page;
