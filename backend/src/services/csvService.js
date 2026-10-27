const escapeCsv = (value) => {
  // This function takes a value and converts it to a CSV-safe string. 
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  // If the value is an array, it joins the elements with a pipe character. 
  // Otherwise, it converts the value to a string (or an empty string if it's null or undefined).
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  // If the text contains a comma, double quote, or newline, 
  // it wraps the text in double quotes and escapes any existing double quotes by doubling them.
};

export const csvService = {
  // The csvService object contains a method for converting an array of student objects into a CSV .
  studentsToCsv(students, statsService) {
    // This method takes an array of student objects and a statsService object as parameters.
    const header = "name,age,field,grades,average";
    // It defines a header string for the CSV file, which includes the column names: name, age, field, grades, and average.
    const rows = students.map((student) =>
      // It maps over the array of student objects and creates a CSV row for each student.
      [
        student.name,
        student.age,
        student.field,
        student.grades,
        statsService.studentAverage(student)
      ]
      // For each student, it creates an array of values corresponding to the columns defined in the header.
        .map(escapeCsv)
        // It applies the escapeCsv function to each value to ensure that it is properly formatted for CSV.
        .join(",")
      // Finally, it joins the escaped values with commas to create a single CSV row for each student.
    );

    return [header, ...rows].join("\n");
    // It combines the header and the rows into a single string, with each row separated by a newline character, 
    // and returns the resulting CSV string.
  }
};
