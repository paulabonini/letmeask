import { ReactNode } from "react";
import cx from "classnames";

import "./styles.scss";

type SongRequestProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
};

export function SongRequest({
  content,
  author,
  children,
  isAnswered = false,
  isHighlighted = false,
}: SongRequestProps) {
  return (
    <div
      className={cx(
        "request",
        {
          answered: isAnswered,
        },
        {
          highlighted: isHighlighted && !isAnswered,
        }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
