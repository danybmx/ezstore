package ezstore.services;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.resteasy.util.Base64;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Path("/media")
public class MediaService {

    private static String UPLOAD_FILE_PATH = "uploads/";

    @POST
    @Path("/products")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadProductImage(MultipartFormDataInput input) throws IOException {

        // Get API input data
        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();

        // Get file name
        String fileName = uploadForm.get("file").get(0).getBodyAsString();

        // Get file data to save
        List<InputPart> inputParts = uploadForm.get("file");

        for (InputPart inputPart : inputParts)
        {
            try {
                // Use this header for extra processing if required
                @SuppressWarnings("unused")
                MultivaluedMap<String, String> header = inputPart.getHeaders();

                // Convert the uploaded file to inputstream
                InputStream inputStream = inputPart.getBody(Base64.InputStream.class, null);

                byte[] bytes = IOUtils.toByteArray(inputStream);

                // Constructs upload file path
                String targetFileName = UUID.randomUUID().toString() + "." + FilenameUtils.getExtension(fileName);
                String targetFile = UPLOAD_FILE_PATH + "products/" + targetFileName;

                writeFile(bytes, targetFile);
                System.out.println("Success!!!!!");

                return Response.ok().entity("{\"filename\": \""+targetFileName+"\"}").build();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        System.out.println(inputParts);

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }


    private void writeFile(byte[] content, String filename) throws IOException {

        File file = new File(filename);

        if (!file.exists()) {
            file.createNewFile();
        }

        FileOutputStream fop = new FileOutputStream(file);

        fop.write(content);
        fop.flush();
        fop.close();

    }
}
