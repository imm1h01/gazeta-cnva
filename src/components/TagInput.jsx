import React, { useState } from "react";
import { X } from "lucide-react";

export default function TagInput({ value = [], onChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 bg-white min-h-[42px]">
      {value.map((tag, index) => (
        <span
          key={index}
          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1 text-xs sm:text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-blue-500 hover:text-blue-700"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? "Adaugă tag-uri și apasă Enter" : ""}
        className="flex-1 outline-none bg-transparent p-1 text-gray-700 text-xs sm:text-sm min-w-[120px]"
      />
    </div>
  );
}