import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { getProducts } from "@/lib/data";

export async function EcommerceSection() {
  const products = await getProducts();

  return (
    <section>
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Shop Our Accessories</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <CardHeader className="p-0 border-b">
                  <div className="aspect-square relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={product.hint}
                      />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <CardTitle className="text-lg font-medium flex-grow">{product.name}</CardTitle>
                  <p className="text-primary font-bold text-xl mt-2">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">
                    <ShoppingCart className="mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            <p>No products available right now. Please check back later!</p>
          </div>
        )}
    </section>
  );
}
