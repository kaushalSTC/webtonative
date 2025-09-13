const TournamentFilters = ({
    setFilterValue,
    isAllLevelsChecked,
    setIsAllLevelsChecked,
    activeFilters
}) => {
    const handleFilterClick = (e) => {
        const { value, checked, dataset } = e.target;
        const { filtertype } = dataset;

        setFilterValue(value, checked, filtertype); // handle all filters equally

        if (filtertype === 'skillLevel') {
            if (value === 'all-levels') {
                setIsAllLevelsChecked(checked);
            } else if (checked && isAllLevelsChecked) {
                setIsAllLevelsChecked(false);
            }
        }
    };

    const getThisWeekDateRange = () => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return {
            startDate: startDate.toLocaleDateString('en-GB'),
            endDate: endDate.toLocaleDateString('en-GB'),
        };
    };

    const getThisMonthDateRange = () => {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        return {
            startDate: startDate.toLocaleDateString('en-GB'),
            endDate: endDate.toLocaleDateString('en-GB'),
        };
    };

    const isDateRangeEqual = (range1, range2) => {
        if (!range1 || !range2) return false;
        return range1.startDate === range2.startDate && range1.endDate === range2.endDate;
    };

    const labelClasses = "max-md:text-xs block border-383838 rounded-3xl cursor-pointer select-none border px-3 py-2 text-383838 text-[14px] font-general font-medium";

    const checkedClasses = "bg-383838 text-white";

    return (
        <div className="mb-[30px]">
        <div className="flex items-center justify-start sm:justify-center gap-5 whitespace-nowrap flex-nowrap overflow-x-auto pt-[30px] pb-[30px] border-b border-f2f2f2 [&::-webkit-scrollbar]:hidden">
            {/* Skill Levels */}
            {[
            { value: "all levels", label: "All Levels" },
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
            ].map(({ value, label }) => {
            const checked = activeFilters.skillLevel.includes(value);
            return (
                <div
                key={value}
                role="checkbox"
                tabIndex={0}
                aria-checked={checked}
                className={`${labelClasses} ${checked ? checkedClasses : ""}`}
                onClick={() =>
                    handleFilterClick({
                    target: {
                        value,
                        checked: !checked,
                        dataset: { filtertype: "skillLevel" },
                    },
                    })
                }
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleFilterClick({
                        target: {
                        value,
                        checked: !checked,
                        dataset: { filtertype: "skillLevel" },
                        },
                    });
                    }
                }}
                >
                {label}
                </div>
            );
            })}

            {/* Date Ranges */}
            {(() => {
            const checkedWeek = isDateRangeEqual(activeFilters.dateRange, getThisWeekDateRange());
            const checkedMonth = isDateRangeEqual(activeFilters.dateRange, getThisMonthDateRange());

            return (
                <>
                <div
                    role="checkbox"
                    tabIndex={0}
                    aria-checked={checkedWeek}
                    className={`${labelClasses} ${checkedWeek ? checkedClasses : ""}`}
                    onClick={() =>
                    handleFilterClick({
                        target: {
                        value: "this-week",
                        checked: !checkedWeek,
                        dataset: { filtertype: "dateRange" },
                        },
                    })
                    }
                    onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleFilterClick({
                        target: {
                            value: "this-week",
                            checked: !checkedWeek,
                            dataset: { filtertype: "dateRange" },
                        },
                        });
                    }
                    }}
                >
                    This Week
                </div>

                <div
                    role="checkbox"
                    tabIndex={0}
                    aria-checked={checkedMonth}
                    className={`${labelClasses} ${checkedMonth ? checkedClasses : ""}`}
                    onClick={() =>
                    handleFilterClick({
                        target: {
                        value: "this-month",
                        checked: !checkedMonth,
                        dataset: { filtertype: "dateRange" },
                        },
                    })
                    }
                    onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleFilterClick({
                        target: {
                            value: "this-month",
                            checked: !checkedMonth,
                            dataset: { filtertype: "dateRange" },
                        },
                        });
                    }
                    }}
                >
                    This Month
                </div>
                </>
            );
            })()}

            {/* Status */}
            {(() => {
            const checkedCompleted = activeFilters.status === "completed";

            return (
                <div
                role="checkbox"
                tabIndex={0}
                aria-checked={checkedCompleted}
                className={`${labelClasses} ${checkedCompleted ? checkedClasses : ""}`}
                onClick={() =>
                    handleFilterClick({
                    target: {
                        value: "completed",
                        checked: !checkedCompleted,
                        dataset: { filtertype: "status" },
                    },
                    })
                }
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleFilterClick({
                        target: {
                        value: "completed",
                        checked: !checkedCompleted,
                        dataset: { filtertype: "status" },
                        },
                    });
                    }
                }}
                >
                Past Tournaments
                </div>
            );
            })()}
        </div>
        </div>
    );
};

export default TournamentFilters;