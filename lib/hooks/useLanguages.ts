import { useQuery } from "@tanstack/react-query";
import { languagesApi } from "@/lib/api/languages";

export function useLanguages() {
  return useQuery({
    queryKey: ['languages'],
    queryFn: () => languagesApi.list(),
  });
}
