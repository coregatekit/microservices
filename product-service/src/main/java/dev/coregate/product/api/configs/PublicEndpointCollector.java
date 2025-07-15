package dev.coregate.product.api.configs;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.coregate.product.api.annotations.PublicEndpoint;

@Component
public class PublicEndpointCollector {

    @Autowired
    private ApplicationContext applicationContext;

    /**
     * Collects all public endpoints from controllers marked with @PublicEndpoint annotation.
     * 
     * @return List of public endpoint patterns
     */
    public List<String> getPublicEndpoints() {
        List<String> publicEndpoints = new ArrayList<>();
        
        // Get all controllers
        String[] controllerNames = applicationContext.getBeanNamesForAnnotation(RestController.class);
        
        for (String controllerName : controllerNames) {
            Object controller = applicationContext.getBean(controllerName);
            Class<?> controllerClass = controller.getClass();
            
            // Get the target class in case of proxies
            Class<?> targetClass = controllerClass;
            if (controllerClass.getName().contains("$$")) {
                // This is likely a CGLIB proxy, get the superclass
                targetClass = controllerClass.getSuperclass();
            }
            
            // Get base path from @RequestMapping on class
            String basePath = "";
            if (targetClass.isAnnotationPresent(RequestMapping.class)) {
                RequestMapping classMapping = targetClass.getAnnotation(RequestMapping.class);
                if (classMapping.value().length > 0) {
                    basePath = classMapping.value()[0];
                }
            }
            
            // Check each method for @PublicEndpoint
            Method[] methods = targetClass.getDeclaredMethods();
            
            for (Method method : methods) {
                if (method.isAnnotationPresent(PublicEndpoint.class)) {
                    String methodPath = extractMethodPath(method);
                    String fullPath = basePath + methodPath;
                    publicEndpoints.add(fullPath);
                }
            }
        }
        
        return publicEndpoints;
    }
    
    private String extractMethodPath(Method method) {
        // Check for various mapping annotations
        if (method.isAnnotationPresent(org.springframework.web.bind.annotation.GetMapping.class)) {
            org.springframework.web.bind.annotation.GetMapping mapping = 
                method.getAnnotation(org.springframework.web.bind.annotation.GetMapping.class);
            return mapping.value().length > 0 ? mapping.value()[0] : "";
        }
        
        if (method.isAnnotationPresent(org.springframework.web.bind.annotation.PostMapping.class)) {
            org.springframework.web.bind.annotation.PostMapping mapping = 
                method.getAnnotation(org.springframework.web.bind.annotation.PostMapping.class);
            return mapping.value().length > 0 ? mapping.value()[0] : "";
        }
        
        if (method.isAnnotationPresent(RequestMapping.class)) {
            RequestMapping mapping = method.getAnnotation(RequestMapping.class);
            return mapping.value().length > 0 ? mapping.value()[0] : "";
        }
        
        return "";
    }
}
