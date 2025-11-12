# Errores Comunes y Soluciones

## 1. Error de CORS
**Síntoma:** Error en la consola del navegador sobre CORS
**Solución:** Asegúrate de que el backend esté corriendo y que el puerto en `environment.ts` coincida con el puerto del backend.

## 2. Error 401 Unauthorized
**Síntoma:** Las peticiones fallan con 401
**Solución:** 
- Verifica que el token JWT se esté guardando correctamente en localStorage
- Verifica que el interceptor esté agregando el token a las peticiones
- Asegúrate de haber iniciado sesión correctamente

## 3. Error de puerto
**Síntoma:** No se puede conectar al backend
**Solución:** 
- El backend por defecto usa el puerto 8080
- Verifica en `frontend/src/environments/environment.ts` que el puerto sea correcto
- Si tu backend corre en otro puerto, cámbialo en el environment.ts

## 4. Error de compilación TypeScript
**Síntoma:** Errores de tipos en la compilación
**Solución:**
- Verifica que todos los imports estén correctos
- Verifica que todas las interfaces estén definidas
- Ejecuta `npm install` para asegurarte de que todas las dependencias estén instaladas

## 5. Error de rutas
**Síntoma:** Las rutas no funcionan o hay loops de redirección
**Solución:**
- Verifica que el AuthGuard no esté bloqueando la ruta de login
- Asegúrate de que las rutas estén correctamente configuradas en `app.module.ts`

## 6. Error al decodificar JWT
**Síntoma:** El rol del usuario no se muestra correctamente
**Solución:**
- Verifica que el token JWT contenga el claim de rol
- Revisa el método `decodeAndStoreUserInfo` en `AuthService`

## Pasos para verificar que todo funcione:

1. **Verifica que el backend esté corriendo:**
   ```bash
   cd backend
   dotnet run
   ```

2. **Verifica el puerto del backend:**
   - Por defecto debería ser 8080
   - Si es otro, actualiza `frontend/src/environments/environment.ts`

3. **Verifica que el frontend pueda conectarse:**
   - Abre la consola del navegador (F12)
   - Verifica que no haya errores de CORS
   - Verifica que las peticiones HTTP se estén haciendo correctamente

4. **Prueba el login:**
   - Usa credenciales válidas de un usuario Admin o User
   - Verifica que el token se guarde en localStorage
   - Verifica que después del login te redirija al dashboard

## Si sigues teniendo problemas:

1. Revisa la consola del navegador para ver errores específicos
2. Revisa la consola del backend para ver errores del servidor
3. Verifica que todas las dependencias estén instaladas: `npm install`
4. Limpia el cache: `npm run build -- --delete-output-path`

