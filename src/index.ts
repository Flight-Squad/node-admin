export class Database {
    hi: string;
    constructor(props: InitProps) {
        this.hi = props.config;
    }
}

export interface InitProps {
    config;
}
