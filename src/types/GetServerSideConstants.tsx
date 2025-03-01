// pages/index.tsx
import { GetServerSideProps } from "next";

// interface Props {
//   startOfDay: string;
//   endOfDay: string;
// }

export const getServerSideProps: GetServerSideProps = async () => {
  // Get the current date
  const currentDate = new Date();

  // Set the start of the day to 7:00 AM (by setting the hours to 7)
  const startOfDay = new Date(currentDate.setHours(7, 0, 0, 0));

  // Set the end of the day to 6:59 AM the next day
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1); // Increment the day by 1
  endOfDay.setHours(6, 59, 59, 999); // Set the time to 6:59:59.999

  // Format the start and end of the day to ISO string or any format you need
  const startOfDayString = startOfDay.toISOString();
  const endOfDayString = endOfDay.toISOString();

  return {
    props: {
      startOfDay: startOfDayString,
      endOfDay: endOfDayString,
    },
  };
};

// "use server";

// function addHours(date: Date, hours: number): Date {
//     const newDate = new Date(date);
//     newDate.setHours(date.getHours() + hours);
//     return newDate;

//     // date.setHours(date.getHours() + hours);
//     // return date;
//   }

// function decreaseHours(date: Date, hours: number): Date {
//     const newDate = new Date(date);
//     newDate.setHours(date.getHours() - hours);
//     return newDate;

//     // date.setHours(date.getHours() - hours);
//     // return date;
//   }

// export async function getServerSideDate() {
//   const currentDate = new Date();
//   return currentDate;
// }

// export async function getServerSideNewSessionCutoffStart() {
//     const newSessionCutoffStartInitial = await getServerSideDate();

//     if (newSessionCutoffStartInitial.getHours() === )

// //   // Set the date to 7 AM UTC
// //   const newSessionCutoffStartInitial = await getServerSideDate();
// //   newSessionCutoffStartInitial.setUTCHours(12, 0, 0, 0);
// //   // newSessionCutoffStart.setUTCHours(7, 0, 0, 0);

// //   return newSessionCutoffStartInitial;
// }

// export async function getServerSideNewSessionCutoffEnd() {
// //   // Set the date to 7 AM UTC
// //   const newSessionCutoffStartInput = await getServerSideDate();
// //   newSessionCutoffStartInput.setUTCHours(12, 0, 0, 0);

// //   const dayMilliseconds = 24 * 60 * 60 * 9999;
// //   const dayMillisecondsUpdate = dayMilliseconds - 1;

// //   return new Date(
// //     // Add 24 hours in milliseconds
// //     newSessionCutoffStartInput.getTime() + dayMillisecondsUpdate
// //   );
// }
