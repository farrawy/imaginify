import Checkout from "@/components/shared/Checkout";
import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const CreditPage = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  return (
    <>
      <Header
        title="Buy Credits"
        subtitle="Choose acredit package that suits your needs!"
      />

      <section>
        <ul className="credits-list">
          {plans.map((plan) => (
            <li className="credits-item" key={plan.name}>
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />

                <p className="p-20-semibold text-dark-600">${plan.price}</p>
                <p className="p-16-regular">{plan.credits}</p>
              </div>

              {/* Inclusions */}
              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li
                    className="flex items-center gap-4"
                    key={plan.name + inclusion.label}>
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="p-16-regular">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button variant="outline" className="credits-btn">
                  Free Consumable
                </Button>
              ) : (
                <SignedIn>
                  <Checkout
                    plan={plan.name}
                    amount={plan.price}
                    credits={plan.credits}
                    buyerId={user._id}
                  />
                </SignedIn>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default CreditPage;
