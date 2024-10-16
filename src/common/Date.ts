export const getDate = (date:string) => {

    const dateObj = new Date(date);
  
    const year = dateObj.getFullYear();
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
    const month = dateObj.getMonth() + 1; // Months are 0-based in JavaScript, so add 1
    const day = dateObj.getDate();
    return monthName+ " " +day+ " " + year
  };
  