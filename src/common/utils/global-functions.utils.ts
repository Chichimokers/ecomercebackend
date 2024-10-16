
/**
 * Mapea un objeto fuente a un Data Transfer Object (DTO) de destino.
 * 
 * @param source   - El objeto fuente que se desea mapear. Debe ser un objeto válido.
 * @param classRef - Una referencia a la clase del DTO de destino. Se utiliza para crear una nueva instancia del DTO.
 * @param options  - Opcional. Un objeto que especifica qué propiedades del DTO incluir en el mapeo.
 *                   Si no se proporciona, se incluirán todas las propiedades del DTO.
 *                   Ejemplo: { include: ['id', 'name', 'email'] }
 * 
 * @returns Una instancia del DTO de destino con las propiedades mapeadas desde el objeto fuente.
 * 
 * @throws Error si el objeto fuente no es un objeto válido.
 * 
 * @example
 * const userDto = mapToDto(user, UserDto, {
 *     include: ['id', 'name', 'email']
 * });
 */
export function mapToDto<T, D>(
    source: T,
    classRef: { new(): D },
    options?: { include?: (keyof D)[] }
): D {
    if (!source || typeof source !== 'object') {
        throw new Error('El objeto fuente debe ser un objeto válido');
    }

    const dto = new classRef();
    const dtoProps = Object.getOwnPropertyNames(dto);
    const propertiesToMap = options?.include ? options.include : dtoProps;

    propertiesToMap.forEach(prop => {
        if (source.hasOwnProperty(prop)) {
            const value = source[prop];

            if (value !== undefined && value !== null) {
                dto[prop] = value; // Asigna el valor directamente
            } else {
                console.warn(`La propiedad ${prop} es indefinida o nula y no se asignará.`);
            }
        } else {
            console.warn(`La propiedad ${prop} no existe en el objeto fuente.`);
        }
    });

    return dto;
}

