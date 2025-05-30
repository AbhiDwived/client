import React, { useState } from "react";

// Import your tab components
import Checklist from "../UserDashboad/CheckList";
import Budget from "../UserDashboad/Budget";
import GuestList from "../UserDashboad/GuestList";
import SavedVendors from "../UserDashboad/SavedVendor";
import Inquiries from "../UserDashboad/Inquiry";
import ProfileTab from "../UserDashboad/UserProfile";

const tabs = [
    { value: "check-list", label: "Checklist", component: Checklist },
    { value: "budget", label: "Budget", component: Budget },
    { value: "guest-list", label: "Guest", component: GuestList },
    { value: "saved-vendor", label: "Vendors", component: SavedVendors },
    { value: "inquiry", label: "Inquiries", component: Inquiries },
    { value: "profile", label: "Profile", component: ProfileTab },
];

const UserDashboard = ({ profile }) => {
    const [activeTab, setActiveTab] = useState("check-list");

    const weddingDate = profile?.weddingDate ? new Date(profile.weddingDate) : null;

    const daysUntilWedding = weddingDate
        ? Math.max(0, Math.floor((weddingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : "--";

    const ActiveComponent = tabs.find(tab => tab.value === activeTab)?.component;

    return (
        <div className="">
            <div className="w-full ">
                {/* Header */}
                <div className=" p-4">
                    <div>
                        <h1 className="text-3xl font-bold font-playfair text-wedding-dark mb-2">
                            Hello, {profile?.name ? profile.name.split("&")[0] : "Guest"}
                        </h1>
                        <p className="text-gray-600">
                            {weddingDate
                                ? weddingDate.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "No wedding date set"}{" "}
                            - {profile?.location || "Location not set"}
                        </p>
                    </div>

                    <div className="flex items-center mt-4 lg:mt-0">
                        <div className="mr-4 text-right">
                            <span className="block text-sm font-medium text-gray-600">Days until wedding</span>
                            <span className="text-xl font-bold text-wedding-dark">{daysUntilWedding}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="">
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-12 bg-gray-200 py-1">
                        {tabs.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setActiveTab(value)}
                                style={{ borderRadius: '5px' }}
                                className={`p-1 transition-colors duration-200 capitalize w-30 ${activeTab === value
                                    ? "text-black bg-white rounded-2xl shadow-2xl"
                                    : "text-gray-500 hover:text-black hover:bg-white"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>


                {/* Tab Content */}
                <div>
                    {ActiveComponent && <ActiveComponent />}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
