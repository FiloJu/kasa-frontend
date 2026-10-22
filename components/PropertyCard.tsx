
import { Property } from "@/app/types/property";

export default function Card({ property }: { property: Property }) {
    return (
        <div>{property.id}</div>
    )
}