package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.entities.structs.Role;
import ezstore.helpers.ErrorHelper;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Path("/media")
public class MediaService {

    private static final String UPLOAD_FILE_PATH = "/data/media/";

    @POST
    @Path("/products")
    @Secured(Role.ADMIN)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadProductImage(MultipartFormDataInput multipartInput) throws IOException {
        Map<String, List<InputPart>> uploadForm = multipartInput.getFormDataMap();

        // Get file data to save
        List<InputPart> inputParts = uploadForm.get("file");

        if (inputParts != null) {
            for (InputPart inputPart : inputParts) {
                try {

                    MultivaluedMap<String, String> header = inputPart.getHeaders();
                    String fileName = getFileName(header);

                    // convert the uploaded file to inputstream
                    InputStream inputStream = inputPart.getBody(InputStream.class, null);

                    // upload file
                    writeFile(inputStream, "products", fileName);

                    return Response.status(200).entity("{\"file\": \"" + fileName + "\"}").build();

                } catch (Exception e) {
                    e.printStackTrace();
                    return ErrorHelper.createResponse(e);
                }
            }
        }

        return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);
    }

    /**
     * writeFile
     *
     * @param inputStream multipart file inputStream
     * @param fileName target file name
     * @throws IOException file saving exception
     */
    private String writeFile(InputStream inputStream, String path, String fileName) throws Exception {
        String filePath = UPLOAD_FILE_PATH + path + "/";
        String qualifiedUploadFilePath = filePath + fileName;

        File parent = new File(filePath);
        if (parent.exists() || parent.mkdirs()) {
            File file = new File(qualifiedUploadFilePath);
            FileOutputStream fop = new FileOutputStream(file);

            int read = 0;
            byte[] bytes = new byte[1024];

            while ((read = inputStream.read(bytes)) != -1) {
                fop.write(bytes, 0, read);
            }

            fop.flush();
            fop.close();

            return qualifiedUploadFilePath;
        } else {
            throw new Exception("Can't create the parent folders to save the image. " + filePath);
        }
    }

    /**
     * getFileName
     *
     * @param header multipart headers
     * @return target file name
     */
    private String getFileName(MultivaluedMap<String, String> header) {
        StringBuilder fileNameBuilder = new StringBuilder();
        fileNameBuilder.append(UUID.randomUUID().toString());

        String[] contentDisposition = header.getFirst("Content-Disposition").split(";");

        for (String filename : contentDisposition) {
            if ((filename.trim().startsWith("filename"))) {
                String[] name = filename.split("=");
                String fileName = name[1].trim().replaceAll("\"", "");
                String fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
                fileNameBuilder.append(".");
                fileNameBuilder.append(fileExtension.toLowerCase());
            }
        }

        return fileNameBuilder.toString();
    }

    public static boolean deleteFile(String filename, String path) {
        String qualifiedFilePath = UPLOAD_FILE_PATH + "/" + path + "/" + filename;
        File file = new File(qualifiedFilePath);
        return file.delete();
    }
}
