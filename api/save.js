export default async function handler(
  req,
  res
){

  if(req.method !== "POST"){

    return res
      .status(405)
      .json({
        error:"Method not allowed"
      });

  }

  try{

    const content =
      JSON.stringify(
        req.body,
        null,
        2
      );

    const owner =
      "YOUR_GITHUB_USERNAME";

    const repo =
      "YOUR_REPO_NAME";

    const path =
      "data/building.json";

    const token =
      process.env.GITHUB_TOKEN;

    // GET CURRENT FILE SHA

    const currentFile =
      await fetch(

        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,

        {

          headers:{

            Authorization:
              `token ${token}`,

            Accept:
              "application/vnd.github+json"

          }

        }

      );

    let sha = null;

    if(currentFile.ok){

      const fileData =
        await currentFile.json();

      sha = fileData.sha;

    }

    // UPDATE FILE

    const response =
      await fetch(

        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,

        {

          method:"PUT",

          headers:{

            Authorization:
              `token ${token}`,

            "Content-Type":
              "application/json"

          },

          body:JSON.stringify({

            message:
              "Update building data",

            content:
              Buffer.from(content)
                .toString("base64"),

            sha

          })

        }

      );

    const data =
      await response.json();

    if(!response.ok){

      return res
        .status(500)
        .json(data);

    }

    return res.json({

      success:true

    });

  }

  catch(error){

    return res
      .status(500)
      .json({

        error:error.message

      });

  }

}
