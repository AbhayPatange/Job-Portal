import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    options: [
      "Bengaluru",
      "Hyderabad",
      "Pune",
      "Mumbai",
      "Chennai",
      "Delhi NCR",
    ],
  },
  {
    filterType: "Role",
    options: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "MERN Stack Developer",
      "Java Developer",
      "DevOps Engineer",
      "Data Analyst",
      "AI/ML Engineer",
    ],
  },
  {
    filterType: "Experience",
    options: ["Fresher", "1 Year", "2 Years", "3+ Years", "5+ Years"],
  },
  {
    filterType: "Salary (LPA)",
    options: ["3-6", "6-10", "10-15", "15-25", "25+"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-white rounded-xl shadow-md border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Filter Jobs</h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedValue("")}
        >
          Clear
        </Button>
      </div>

      <RadioGroup
        value={selectedValue}
        onValueChange={setSelectedValue}
        className="space-y-5"
      >
        {filterData.map((section, index) => (
          <div key={index}>
            <h3 className="font-semibold text-gray-800 mb-3">
              {section.filterType}
            </h3>

            <div className="space-y-2">
              {section.options.map((item, idx) => {
                const id = `${section.filterType}-${idx}`;

                return (
                  <div
                    key={id}
                    className="flex items-center space-x-3"
                  >
                    <RadioGroupItem value={item} id={id} />
                    <Label
                      htmlFor={id}
                      className="cursor-pointer text-gray-700"
                    >
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;