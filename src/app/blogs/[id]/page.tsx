import { CardDescription } from "@/components/ui/card";
import { blogPosts } from "@/constants/blog-posts";
import React from "react";

type Props = {
  params: {
    id: number;
  };
};

const PostPage = ({ params: { id } }: Props) => {
  const post = blogPosts.find((post) => post.id == id);
  return (
    <div className="container flex justify-center my-10">
      <div className="lg:w-6/12 flex flex-col">
        <CardDescription>{post?.createdAt}</CardDescription>
        <h2 className="text-6xl font-bold">{post?.title}</h2>
        <div className="text-xl flex flex-col mt-10 gap-10">
          <div>{post?.description1}</div>
          <div>
            <img src={post?.image} className="w-full rounded-3xl" />
          </div>
          <div>{post?.description2}</div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
