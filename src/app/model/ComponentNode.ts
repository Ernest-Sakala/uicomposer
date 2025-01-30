export class ComponentNode {
    type!: string;
    label!: string;
    properties!: { [key: string]: any };
    styles!: { [key: string]: any };
    children!: ComponentNode[];
}
  

