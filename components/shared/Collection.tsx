"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { transformationTypes } from "@/constants";
import { IImage } from "@/lib/database/models/image.model";
import { formUrlQuery } from "@/lib/utils";

import { Button } from "../ui/button";

import Search from "./Search";

const Card = ({ image }: { image: IImage }) => {
  return (
    <li>
      <Link href={`/transformations/${image._id}`} className="collection-card">
        <CldImage
          src={image.publicId}
          alt={image.title}
          width={image.width}
          height={image.height}
          {...image.config}
          loading="lazy"
          className="w-full h-52 rounded-[10px] object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />

        <div className="flex-between">
          <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">
            {image.title}
          </p>
          <Image
            src={`/assets/icons/${
              transformationTypes[
                image.transformationType as TransformationTypeKey
              ].icon
            }`}
            alt={image.title}
            width={24}
            height={24}
          />
        </div>
      </Link>
    </li>
  );
};

const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
}: {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // PAGINATION HANDLER
  const onPageChange = (action: string) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <div className="collection-heading">
        <h2 className="h2-bold text-dark-600">Recent Edits</h2>
        {hasSearch && <Search />}
      </div>

      {images.length > 0 ? (
        <ul className="collection-list">
          {images.map((image) => (
            <Card image={image} key={image._id} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold">Empty List</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={Number(page) <= 1}
              className="collection-btn"
              onClick={() => onPageChange("prev")}>
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default Collection;

// Video Maker by invideo AI wants to talk to video-ai.invideo.io
// {
//   "brief": "Create a YouTube Shorts video showcasing the web development and landing page creation services provided to help businesses convert clients effectively. Highlight the importance of having a professionally designed website and a high-converting landing page in today's digital age, where online presence is crucial for business success. Showcase examples of sleek, responsive websites and landing pages designed for various industries, emphasizing customization, user experience, and the impact on conversion rates. Include testimonials from satisfied clients and statistics to back up the success rates of these services.",
//   "settings": "Use a dynamic and professional tone with a modern, tech-savvy background music. The voiceover should be clear, engaging, and articulate the value of professional web development and landing page creation.",
//   "title": "Boost Your Business with Professional Web Development & Landing Page Services",
//   "description": "Discover how our web development and landing page services can transform your online presence, enhance user experience, and skyrocket your conversion rates. Perfect for businesses looking to make a significant impact online.",
//   "platforms": [
//     "YouTube Shorts",
//     "TikTok",
//     "Instagram Reels"
//   ],
//   "audiences": [
//     "Business owners",
//     "Entrepreneurs",
//     "Marketing professionals"
//   ],
//   "length_in_minutes": 1
// }
