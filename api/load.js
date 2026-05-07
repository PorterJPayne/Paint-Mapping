export default async function handler(
  req,
  res
){

  try{

    const owner =
      "PorterJPayne";

    const repo =
      "Paint-Mapping";

    const path =
      "data/building.json";

    const response =
      await fetch(

        `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`

      );

    if(!response.ok){

      return res.json(null);

    }

    const data =
      await response.json();

    return res.json(data);

  }

  catch(error){

    return res
      .status(500)
      .json({

        error:error.message

      });

  }

}
