import React, { useState } from "react";
import "./style.css";

import arrowIcon from "./images/icon-arrow.svg";
import { isLeapYear } from "./functions";

const monthsAndDays = [
  {
    month: 1,
    days: 31,
  },
  {
    month: 2,
    days: {
      leap: 29,
      common: 28,
    },
  },
  {
    month: 3,
    days: 31,
  },
  {
    month: 4,
    days: 30,
  },
  {
    month: 5,
    days: 31,
  },
  {
    month: 6,
    days: 30,
  },
  {
    month: 7,
    days: 31,
  },
  {
    month: 8,
    days: 31,
  },
  {
    month: 9,
    days: 30,
  },
  {
    month: 10,
    days: 31,
  },
  {
    month: 11,
    days: 30,
  },
  {
    month: 12,
    days: 31,
  },
];

const App = () => {
  const [formData, setFormData] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [formErrors, setFormErrors] = useState({
    day: "",
    month: "",
    year: "",
    generic: "",
  });

  const [output, setOutput] = useState({
    days: "",
    months: "",
    years: "",
  });

  const hasErrors =
    formErrors.day || formErrors.month || formErrors.year || formErrors.generic;

  const dateDiff = (date) => {
    date = date.split("-");
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const yy = parseInt(date[0]);
    const mm = parseInt(date[1]);
    const dd = parseInt(date[2]);
    let years, months, days;

    months = month - mm;
    if (day < dd) {
      months = months - 1;
    }

    years = year - yy;
    if (month * 100 + day < mm * 100 + dd) {
      years = years - 1;
      months = months + 12;
    }

    days = Math.floor(
      (today.getTime() - new Date(yy + years, mm + months - 1, dd).getTime()) /
        (24 * 60 * 60 * 1000)
    );

    return { years: years, months: months, days: days };
  };

  const handleSubmit = (day, month, year) => {
    const dayAsNumber = Number(day);
    const monthAsNumber = Number(month);
    const yearAsNumber = Number(year);

    const today = new Date();
    const chosenDate = new Date(year, month - 1, day);

    const currentMonth = monthsAndDays.find(
      (item) => item.month === monthAsNumber
    );

    const validateDayForFebruary = () => {
      if (monthAsNumber === 2) {
        let maxDays;

        if (isLeapYear(yearAsNumber)) {
          maxDays = currentMonth?.days?.leap;
        } else {
          maxDays = currentMonth?.days?.common;
        }

        if (dayAsNumber <= maxDays) {
          return true;
        } else {
          return false;
        }
      }

      return false;
    };

    const isDayInputValid =
      dayAsNumber > 1 &&
      ((monthAsNumber !== 2 && dayAsNumber <= (currentMonth?.days || 31)) ||
        validateDayForFebruary());

    const isMonthInputValid = monthAsNumber >= 1 && monthAsNumber <= 12;

    const isYearInputValid =
      yearAsNumber > 1 && yearAsNumber <= today.getFullYear();

    const isPastDate = today - chosenDate < 0;

    if (!day) {
      setFormErrors((prevState) => ({
        ...prevState,
        day: "This field is required",
        month: formErrors.month && isMonthInputValid ? "" : prevState.month,
        year: formErrors.year && isYearInputValid ? "" : prevState.year,
      }));
    }

    if (!month) {
      setFormErrors((prevState) => ({
        ...prevState,
        day: formErrors.day && isDayInputValid ? "" : prevState.day,
        month: "This field is required",
        year: formErrors.year && isYearInputValid ? "" : prevState.year,
      }));
    }

    if (!year) {
      setFormErrors((prevState) => ({
        ...prevState,
        day: formErrors.day && isDayInputValid ? "" : prevState.day,
        month: formErrors.month && isMonthInputValid ? "" : prevState.month,
        year: "This field is required",
      }));
    }

    const isPrecheckValid =
      isDayInputValid && isMonthInputValid && isYearInputValid;

    if (!isPrecheckValid) {
      console.log(isDayInputValid, isMonthInputValid, isYearInputValid);

      if (!isDayInputValid && day) {
        setFormErrors((prevState) => ({
          day: "Must be a valid day",
          month: formErrors.month && isMonthInputValid ? "" : prevState.month,
          year: formErrors.year && isYearInputValid ? "" : prevState.year,
          generic: "",
        }));
      }

      if (!isMonthInputValid && month) {
        setFormErrors((prevState) => ({
          day: formErrors.day && isDayInputValid ? "" : prevState.day,
          month: "Must be a valid month",
          year: formErrors.year && isYearInputValid ? "" : prevState.year,
          generic: "",
        }));
      }

      if (!isYearInputValid && year) {
        setFormErrors((prevState) => ({
          day: formErrors.day && isDayInputValid ? "" : prevState.day,
          month: formErrors.month && isMonthInputValid ? "" : prevState.month,
          year: "Must be a valid year",
          generic: "",
        }));
      }
    } else if (isPrecheckValid && isPastDate) {
      setFormErrors(() => ({
        day: "",
        month: "",
        year: "",
        generic: "Must be a date in the past",
      }));
    } else {
      if (hasErrors) {
        setFormErrors({
          day: "",
          month: "",
          year: "",
          generic: "",
        });
      }

      const formattedDate = `${year}-${month}-${day}`;
      const { years, months, days } = dateDiff(formattedDate);

      setOutput({
        days: days,
        months: months,
        years: years,
      });

      setFormErrors(() => ({
        day: "",
        month: "",
        year: "",
        generic: "",
      }));
    }
  };

  return (
    <div className="card-container">
      <div className="inputs-container">
        <div className="input-label-container">
          <label
            htmlFor="day"
            style={{
              color: hasErrors ? "hsl(0, 100%, 67%)" : "hsl(0, 1%, 44%)",
            }}
          >
            Day
          </label>
          <input
            type="number"
            placeholder="DD"
            id="day"
            min={1}
            value={formData.day}
            style={{
              border: hasErrors
                ? "1px solid hsl(0, 100%, 67%)"
                : "1px solid hsl(0, 0%, 94%)",
            }}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                day: e.target.value,
              }))
            }
          />
          {formErrors.day && <p className="error">{formErrors.day}</p>}
        </div>

        <div className="input-label-container">
          <label
            htmlFor="month"
            style={{
              color: hasErrors ? "hsl(0, 100%, 67%)" : "hsl(0, 1%, 44%)",
            }}
          >
            Month
          </label>
          <input
            type="number"
            placeholder="MM"
            id="month"
            style={{
              border: hasErrors
                ? "1px solid hsl(0, 100%, 67%)"
                : "1px solid hsl(0, 0%, 94%)",
            }}
            min={1}
            value={formData.month}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                month: e.target.value,
              }))
            }
          />
          {formErrors.month && <p className="error">{formErrors.month}</p>}
        </div>

        <div className="input-label-container">
          <label
            htmlFor="year"
            style={{
              color: hasErrors ? "hsl(0, 100%, 67%)" : "hsl(0, 1%, 44%)",
            }}
          >
            Year
          </label>
          <input
            type="number"
            placeholder="YYYY"
            id="year"
            style={{
              border: hasErrors
                ? "1px solid hsl(0, 100%, 67%)"
                : "1px solid hsl(0, 0%, 94%)",
            }}
            min={1}
            value={formData.year}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                year: e.target.value,
              }))
            }
          />
          {formErrors.year && <p className="error">{formErrors.year}</p>}
        </div>
      </div>

      {formErrors.generic && (
        <p className="error generic">{formErrors.generic}</p>
      )}
      <div className="divider-container">
        <div className="divider"></div>

        <button
          className="btn"
          onClick={() =>
            handleSubmit(formData.day, formData.month, formData.year)
          }
        >
          <img src={arrowIcon} alt="arrowIcon" />
        </button>
      </div>

      <div className="output-container">
        <h1>
          <span className="highlighted">
            {output.years === "" ? "--" : output.years}{" "}
          </span>{" "}
          {output.years === 1 ? "year" : "years"}
        </h1>
        <h1>
          <span className="highlighted">
            {output.months === "" ? "--" : output.months}{" "}
          </span>{" "}
          {output.months === 1 ? "month" : "months"}
        </h1>
        <h1>
          <span className="highlighted">
            {output.days === "" ? "--" : output.days}{" "}
          </span>{" "}
          {output.days === 1 ? "day" : "days"}
        </h1>
      </div>
    </div>
  );
};

export default App;
