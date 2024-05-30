import React from 'react';

function DashboardCard13() {
  return (


    <div className="bg-white mt-8 dark:bg-gray-800  shadow-xl border dark:border-gray-700 p-5 xl:mt-6">
      <h2 className="text-sm mb-4 font-medium">Les rendez-vous d'aujourd'hui</h2>
      <div className="grid grid-cols-12 gap-2 items-center">
        <p className="text-textGray text-[12px] col-span-3 font-light">2 hrs later</p>
        <div className="flex-colo relative col-span-2">
          <hr className="w-[2px] h-20 bg-border"></hr>
          <div className="w-7 h-7 flex-colo text-sm bg-opacity-10 bg-orange-500 text-orange-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path>
            </svg>
          </div>
        </div>
        <a className="flex flex-col gap-1 col-span-6" href="/appointments">
          <h2 className="text-xs font-medium">Minahil Khan</h2>
          <p className="text-[12px] font-light text-textGray">
            "10:00 AM" - "12:00 PM"
          </p>
        </a>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <p className="text-textGray text-[12px] col-span-3 font-light">2 hrs later</p>
        <div className="flex-colo relative col-span-2">
          <hr className="w-[2px] h-20 bg-border"></hr>
          <div className="w-7 h-7 flex-colo text-sm bg-opacity-10
                   false
                  false
                  bg-green-500 text-green-500
                   rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
            </svg>
          </div>
        </div>
        <a className="flex flex-col gap-1 col-span-6" href="/appointments">
          <h2 className="text-xs font-medium">Minahil Khan</h2>
          <p className="text-[12px] font-light text-textGray">
            "10:00 AM" - "12:00 PM"
          </p>
        </a>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <p className="text-textGray text-[12px] col-span-3 font-light">2 hrs later</p>
        <div className="flex-colo relative col-span-2">
          <hr className="w-[2px] h-20 bg-border"></hr>

          <div className="w-7 h-7 flex-colo text-sm bg-opacity-10
                   false
                  bg-red-500 text-red-500
                  false
                   rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
            </svg>

          </div>
        </div>
        <a className="flex flex-col gap-1 col-span-6" href="/appointments">
          <h2 className="text-xs font-medium">Minahil Khan</h2>
          <p className="text-[12px] font-light text-textGray">
            "10:00 AM" - "12:00 PM"
          </p>
        </a>
      </div>

    </div>
  );
}


export default DashboardCard13;
