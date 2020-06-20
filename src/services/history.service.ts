import { BehaviorSubject } from "rxjs";

class HistoryService {
    currentPathname: string | null = null;

    public currentStack: string[] = [];
    public stack = new BehaviorSubject<string[]>([]);

    canGoBack(currentPathname:string):boolean{
        return this.currentStack.length > 1;
    }

    onApp() {
    }

    on(pathname: string) {
        console.log('on', pathname);
        if (this.currentStack[this.currentStack.length - 1] !== pathname) {
            this.currentStack.push(pathname);
            console.log(this.currentStack);
            this.stack.next(this.currentStack);
        }
        this.currentPathname = pathname;
    }
}

export default new HistoryService();