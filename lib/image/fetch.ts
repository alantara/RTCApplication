// image fetch from api/images


export async function LibFetchImage(image: File) {
    const body = new FormData();
    body.append("image_upload", image);

    let imgUpload = await fetch("/api/images/upload", {
        method: "POST",
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: body
    })

    return imgUpload
}
