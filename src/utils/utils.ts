// utils.ts

export function setLocalStorageWithExpiration(
  key: string,
  value: any,
  expirationMinutes: number
): void {
  const now = new Date();
  const item = {
    value: value,
    expiration: now.getTime() + expirationMinutes * 60 * 1000, // Convert minutes to milliseconds
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageWithExpiration(key: string): any {
  const item = localStorage.getItem(key);

  if (item === null) {
    return null; // Handle the case where the item is not found in localStorage
  }

  try {
    const parsedItem = JSON.parse(item);

    if (typeof parsedItem === "object" && "expiration" in parsedItem) {
      const now = new Date().getTime();
      if (now < parsedItem.expiration) {
        return parsedItem.value; // Return the data if it's not expired
      } else {
        localStorage.removeItem(key); // Remove the item if it's expired
      }
    }
    return null;
  } catch (error) {
    console.error("Error parsing item from localStorage:", error);
    return null;
  }
}

export function getMinutesUntilTomorrowMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Set to midnight (00:00:00)

  // Calculate the time difference in milliseconds
  const timeDifference = tomorrow.getTime() - now.getTime();

  // Convert milliseconds to minutes
  return Math.floor(timeDifference / (1000 * 60));
}

export function getRandomDate() {
  const start = new Date(2022, 0, 1); // Start date (e.g., Jan 1, 2022)
  const end = new Date(); // Current date
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export function getRandomDateString(): string {
  const date = getRandomDate();
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  if (month.length < 2) {
    month = "0" + month;
  }

  if (day.length < 2) {
    day = "0" + day;
  }

  return `${year}-${month}-${day}`;
}
