
import { Dispatch, SetStateAction, useState, createContext, useEffect } from "react"
import IssueListBody from "./IssueListBody"
import IssueListHeader from "./IssueListHeader"
import { SearchFilters } from "@/types/types";
import { Issue } from "./types";
import { UseSearchFiltersHook, useSearchFilters } from "@/hooks/useSearchFilters";

// export const IssueListContext = createContext<{ searchParams: SearchFilters, setSearchParams: Dispatch<SetStateAction<SearchFilters>> }>({
//   searchParams: {
//     open: true,
//     sort: "newest"
//   },
//   setSearchParams: () => { },
// });

type ContextType<T extends SearchFilters> = {
  searchFilters: SearchFilters;
  setSearchParam: <K extends keyof T>(param: K, value: T[K]) => void;
};

export const IssueListContext = createContext<ContextType<SearchFilters>>({
  searchFilters: {
    open: true,
    sort: "newest"
  },
  setSearchParam: () => { },
});

type IssueListProps = {
  issues: Issue[];
  useSearchFiltersHook: UseSearchFiltersHook<SearchFilters>;
};

export function IssueList2({ issues, useSearchFiltersHook }: IssueListProps) {
  console.log("Current search filters: ", useSearchFiltersHook.searchFilters)

  // if(!issues) {
  //   return <div>No issues found! Try creating some</div>
  // }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3/4">
      <div className="bg-white shadow-md rounded-md">
        <IssueListContext.Provider value={{ searchFilters: useSearchFiltersHook.searchFilters, setSearchParam: useSearchFiltersHook.setSearchParam }}>
          <IssueListHeader />
          <IssueListBody issues={issues ?? []} />
        </IssueListContext.Provider>
      </div>
    </div>
  )
}


// export default function IssueList({ issues, onUpdate }: { issues: Issue[], onUpdate: (searchParams: SearchFilters) => void }) {
//   const [searchParams, setSearchParams] = useState<SearchFilters>({
//     open: true,
//     sort: "newest"
//   })

//   useEffect(() => { 
//     onUpdate(searchParams);
//   }, [searchParams])

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-3/4">
//       <div className="bg-white shadow-md rounded-md">
//         <IssueListContext.Provider value={{ searchParams, setSearchParams }}>
//           <IssueListHeader />
//           <IssueListBody issues={issues} />
//         </IssueListContext.Provider>
//       </div>
//     </div>
//   )
// }
