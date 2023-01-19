interface IQueue<T> {
    enqueue(item: T): void;
    dequeue(): T | undefined;
    size(): number;
    show(): void;
}

export class Queue<T> implements IQueue<T> {
    private storage: T[] = [];
    private readonly capacity: number;

    constructor(capacity: number = 5000) {
        this.capacity = capacity;
    }
    enqueue(item: T): void {
        if (this.storage.length === this.capacity) {
            throw Error('The queue has reached its maximum size!');
        }
        this.storage.push(item);
    }

    dequeue(): T {
        if (this.storage.length === 0) {
            throw Error('The queue is empty!');
        }
        return this.storage.shift();
    }

    size(): number {
        return this.storage.length;
    }

    show(): void {
        console.log(this.storage);
    }
}