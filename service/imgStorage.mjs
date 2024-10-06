import { BlobServiceClient, ContainerSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob';
import 'dotenv/config';

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'appwebimg';

export const uploadImageAndGetUrl = async (imageBuffer, imageName) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Crear el contenedor si no existe y establecer la política de acceso público
    // Nota: Esto es solo necesario si no has creado el contenedor previamente
    // o si necesitas cambiar la política de acceso.
    // Comenta o elimina esta parte si tu contenedor ya está configurado correctamente.
    const createContainerResponse = await containerClient.createIfNotExists({ access: 'blob' });
    console.log(`Create container response: ${createContainerResponse.succeeded ? 'Succeeded' : 'Failed or Container already exists'}`);

    const blockBlobClient = containerClient.getBlockBlobClient(imageName);
    await blockBlobClient.upload(imageBuffer, imageBuffer.length);

    // Opcionalmente, generar una SAS si necesitas un control de acceso más granular o si el contenedor no es público
    // const sasToken = generateBlobSASQueryParameters({
    //     containerName,
    //     blobName: imageName,
    //     permissions: ContainerSASPermissions.parse("r"), // Permisos de lectura
    //     startsOn: new Date(),
    //     expiresOn: new Date(new Date().valueOf() + 86400), // SAS válida por 24 horas
    // }, blobServiceClient.credential).toString();

    // Devolver la URL del blob
    // Si estás usando SAS, asegúrate de incluir el token en la URL
    // return `${blockBlobClient.url}?${sasToken}`;
    return blockBlobClient.url;
};
