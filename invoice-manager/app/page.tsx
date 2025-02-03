import Image from "next/image";
import Link from "next/link";
import ProductCart from "./ components/ProductCart";

export default function Home() {
  return (
    <main>
      <h1>hello world</h1>
      <Link href="/users">Users</Link>
      <ProductCart></ProductCart>
    </main>
  );
}
