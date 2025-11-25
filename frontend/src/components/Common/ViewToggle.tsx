import React from "react";

interface ViewToggleProps {
    viewMode: "map" | "list";
    onChange: (mode: "map" | "list") => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange }) => {
    return (
        <div className="flex bg-gray-100 p-1 rounded-lg inline-flex">
            <button
                onClick={() => onChange("map")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "map"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
            >
                Map View
            </button>
            <button
                onClick={() => onChange("list")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "list"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
            >
                List View
            </button>
        </div>
    );
};
