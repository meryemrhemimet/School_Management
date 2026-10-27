const average = (numbers) => {
// This function calculates the average of an array of numbers.
  if (!numbers.length) {
  // If the array is empty, it returns 0 to avoid division by zero.
    return 0;
  }

  const total = numbers.reduce((sum, number) => sum + number, 0);
  // It uses the reduce method to sum up all the numbers in the array, starting with an initial value of 0.
  return Number((total / numbers.length).toFixed(2));
  // Finally, it divides the total by the length of the array to get the average 
};

export const statsService = {
  // The statsService object contains methods for calculating statistics related to students.
  studentAverage(student) {
  // This method calculates the average grade for a given student.
    return average(student.grades);
    // It calls the average function with the student's grades to compute the average grade and returns the result.
  },

  groupAverage(students) {
  // This method calculates the average grade for a group of students.
    return average(students.flatMap((student) => student.grades));
    // It uses the flatMap method to create a single array of all grades from all students
  }
};
