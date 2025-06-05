import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-40 w-full">
      <HeroSection />
      <section>
        <div className="flex flex-col items-center justify-center py-10 bg-gray-100 mt-40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 p-4">
            {statsData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-between p-4"
              >
                <h2 className="text-3xl font-bold text-gray-800">
                  {item.value}
                </h2>
                <p className="text-lg text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="md:mt-32 mt-16">
            <h1 className="text-center text-3xl font-bold">
              EveryThing you need to manage
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-6">
              {featuresData.map((item, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center justify-center gap-4 p-4">
                    <div className="text-blue-600 mx-auto">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="md:mt-32 mt-16 bg-blue-50 py-20">
          <h1 className="text-center text-3xl font-bold ">How It Works</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-6">
            {howItWorksData.map((item, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
                  <div className="text-blue-600 mx-auto">{item.icon}</div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="md:mt-32 mt-16 bg-blue-50 py-20">
          <h1 className="text-center text-3xl font-bold ">
            What our User says
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-6">
            {testimonialsData.map((item, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col  gap-4 p-4">
                  <div className="flex gap-5 items-center">
                    <Image
                      className="rounded-full"
                      src={`person${index+1}.jpeg` ||item.image }
                      alt={item.name}
                      width={40}
                      height={40}
                    />
                    <div className=" flex flex-col  mt-2">
                      <h1>{item.name}</h1>
                      <h1>{item.role}</h1>
                    </div>
                  </div>
                  <div><p>{item.quote}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className=" mt-16 bg-blue-600 py-20 text-center text-white ">
          <h1 className="text-center text-3xl font-bold  ">
           Ready to take control of your finances?
          </h1>
          <p>Thousand of user already managing the finance</p>
          
        <div>
         <Link href={'/dashboard'}><Button className={'text-blue-500 mt-5 animate-bounce'} variant={'outline'}>Get free Trial</Button></Link> 
        </div>
        </div>
      </section>
      
    </div>
  );
}
