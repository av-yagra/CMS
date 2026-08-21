import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
};

export default function DestinationCard({ id, name, country, image, description }: Props) {
  return (
    <Link
      href={`/destinations/${id}`}
      className="group block rounded-xl overflow-hidden border border-black/5 bg-white hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="font-heading font-semibold text-lg text-zinc-900">{name}</p>
        <p className="text-sm text-zinc-500">{country}</p>
        <p className="text-sm text-zinc-600 mt-2">{description}</p>
      </div>
    </Link>
  );
}