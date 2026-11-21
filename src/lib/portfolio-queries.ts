import { queryOptions } from "@tanstack/react-query";
import { getAdminPortfolio, getPublicPortfolio } from "./portfolio.functions";

export const publicPortfolioOptions = queryOptions({ queryKey: ["portfolio", "public"], queryFn: () => getPublicPortfolio(), staleTime: 60_000 });
export const adminPortfolioOptions = queryOptions({ queryKey: ["portfolio", "admin"], queryFn: () => getAdminPortfolio(), staleTime: 0 });