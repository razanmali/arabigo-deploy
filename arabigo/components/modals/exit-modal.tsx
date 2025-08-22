"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExitModal } from "@/store/use-exit-modal";


export const ExitModal = () =>{
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close} = useExitModal();

    useEffect(() => setIsClient(true), []);

    if(!isClient) {
        return null;
    }

    return(
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image src="/rabbit_sad.svg"
                        alt="Rabbit"
                        height={80}
                        width={80}/>
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Подождите, не уходите!
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Вы собираетесь выйти из урока. Вы уверены?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant="primary" 
                        className="w-full"
                        size="lg" 
                        onClick={close}
                        >
                         Продолжайте учиться
                        </Button>
                        <Button variant="dangerOutline" 
                        className="w-full"
                        size="lg" 
                        onClick={() => {
                            close();
                            router.push("/learn");
                        }}
                        >
                         Выйти
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
            </Dialog>
    );

};