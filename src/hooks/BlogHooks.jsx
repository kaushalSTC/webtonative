import { useQuery } from "@tanstack/react-query";
import { getBlogs, getBlogDetail } from "../api/blog";

export const useBlogListing = () => {
  return useQuery({
    queryKey: ["blogs", ],
    retry: false,
    queryFn: () => getBlogs(),
  })
}

export const useBlogDetail = ({handle}) => {
  return useQuery({
    queryKey: ["blog-detail", handle],
    retry: false,
    queryFn: () => getBlogDetail({handle}),
  })
}