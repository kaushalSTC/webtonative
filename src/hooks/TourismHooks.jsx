import { useQuery } from "@tanstack/react-query";
import { getTourismSection } from "../api/tourism";

export const useTourismSection = ({ sectionName }) => {
    return useQuery({
        queryKey: ["tourism-section", sectionName],
        queryFn: () => getTourismSection({sectionName}), 
    })
}