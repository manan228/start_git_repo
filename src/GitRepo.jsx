import React from "react";
import Moment from "react-moment";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const GitRepo = () => {
  const [gitRepo, setGitRepo] = useState([]);
  const [page, setPage] = useState(1);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const getMostStaredGitRepo = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc&page=${page}`,
          {
            headers: {
              Authorization:
                "Bearer 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",
            },
          }
        );

        console.log(response.data)
        setGitRepo((previousGitRepo) => [
          ...previousGitRepo,
          ...response.data.items,
        ]);
      } catch (err) {
        console.log(err);
      }
    };

    getMostStaredGitRepo();
  }, [page]);

  const options = {
    title: {
      text: "My chart",
    },
    series: [
      {
        data: [1, 2, 3],
      },
    ],
  };

  const observer = useRef();

  const lastgitRepo = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting)
        setPage((previousPage) => previousPage + 1);
    });

    if (node) observer.current.observe(node);
  }, []);

  const onExpandClickHandler = () => {
    setFlag(true);
  };

  return (
    <>
      {gitRepo.length > 0 &&
        gitRepo.map((repo, index) => {
          const refProps =
            gitRepo.length === index + 1 ? { ref: lastgitRepo } : {};
          return (
            <li
              {...refProps}
              key={repo.name}
              style={{
                position: "relative",
                border: "1px solid black",
                listStyleType: "none",
                maxWidth: "800px",
              }}
            >
              <div>
                <div>{repo.name}</div>
                <div>{repo.description}</div>
              </div>
              <div style={{ display: "inline" }}>
                <div>{repo.stargazers_count}</div>
                <div>{repo.open_issues_count}</div>
                <div style={{ display: "inline-block" }}>
                  {repo.owner.login}
                </div>
              </div>
              <img
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "auto",
                  maxWidth: "100px",
                  margin: "2.5px",
                }}
                alt="owner_img"
                src={repo.owner.avatar_url}
              />
              <div>
                {`Last pushed at `}
                <Moment format="DD/MM/YYYY">{gitRepo.updated_at}</Moment>
                {` by ${repo.name}`}
              </div>
              <span onClick={onExpandClickHandler}>Expand</span>
              {flag && (
                <HighchartsReact highcharts={Highcharts} options={options} />
              )}
            </li>
          );
        })}
    </>
  );
};

export default GitRepo;
