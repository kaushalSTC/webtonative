import { getAboutUs } from "../api/aboutUs";
import { useQuery } from "@tanstack/react-query";

export const useGetAboutUs = ({sectionName}) => {
    return useQuery({
        queryKey: ['about-us', sectionName],
        queryFn: () => getAboutUs({sectionName}),
    })
}