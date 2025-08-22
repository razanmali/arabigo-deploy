import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import 
 {
    ClerkLoading,
    ClerkLoaded,
    UserButton
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
type Props = {
    className?: string;
};

export const Sidebar = ({className}: Props) =>{
    return(
        <div className={cn("flex h-full lg:w-[256px] lg:fixed left-0 top-0 border-r-2 flex-col",className,)}>
            <Link href="/learn">
              <div className="pt-8 pl-4 pb-7 flex items-center gap-x-0.5">
                     <Image 
                       src="/logo.svg" 
                       height={50} 
                       width={50} 
                       alt="Arabigo" 
                     />
                     <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
                       Arabigo
                     </h1>
                   </div>
                   </Link>
                   <div className="flex flex-col gap-y-2 flex-1">
                    <SidebarItem 
                    label="Учить"
                     href="/learn"
                     iconSrc="/learn.svg"/>
                     <SidebarItem 
                    label="Рейтинг"
                     href="/leaderboard"
                     iconSrc="/leaderboard.svg"/>
                     <SidebarItem 
                    label="Квесты"
                     href="/quests"
                     iconSrc="/quests.svg"/>
                     <SidebarItem 
                    label="Магазин"
                     href="/shop"
                     iconSrc="/shop.svg"/>
                   </div>
                   <div className="p-4">
                    <ClerkLoading>
                        <Loader className="h-5 w-5 text-muted-foreground animate-spin"/>
                    </ClerkLoading>
                    <ClerkLoaded>
                        <UserButton afterSignOutUrl ="/"/>
                    </ClerkLoaded>
                   </div>
        </div>
    );
};